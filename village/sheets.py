import load_libs; load_libs.do()
import flask
from flask import render_template
import yaml
import json
import os
import gspread
import httplib2
from apiclient import errors
from apiclient.discovery import build
from oauth2client.client import SignedJwtAssertionCredentials
from oauth2client import client
import socket
socket.setdefaulttimeout(50)

root = flask.Flask(__name__)
local_config = yaml.load(open(os.path.join(os.path.dirname(__file__), '../config.yaml')))
conf = local_config['spreadsheet']
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
sheet_docids = ['asset_bundle_docid', 'catalog_docid', 'messages_docid', 'problems_docid', 'goals_docid', 'dropdown_menu_docid', 'special_events_docid']

@root.route('/sheets/setup')
def setup_sheets():
    return render_template('setup_sheets.html')

@root.route('/sheets/copyandshare', methods=['POST'])
def share_sheets_route():
    json_data = flask.request.get_json(True)
    auth_code = json_data['code']

    constructor_kwargs = {
            'redirect_uri': 'postmessage',
            'auth_uri': "https://accounts.google.com/o/oauth2/auth",
            'token_uri': "https://accounts.google.com/o/oauth2/token",
        }
    flow = client.OAuth2WebServerFlow(
        json_data['clientID'], json_data['clientSecret'],
        'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file', **constructor_kwargs)

    credentials = flow.step2_exchange(auth_code)

    http = credentials.authorize(httplib2.Http())

    drive_service = build('drive', 'v2', http=http)

    about = drive_service.about().get().execute()
    
    file_metadata = {
        'title' : 'Village Makeover Spreadsheets',
        'parents' : [{'id': about['rootFolderId']}],
        'mimeType' : 'application/vnd.google-apps.folder'
    }
    folder = drive_service.files().insert(body=file_metadata,
                                    fields='id').execute()
    
    folder_id = folder.get('id')

    new_config_sheet = copy_sheet(drive_service, "1r7LKoEI-1kFhSnH75XwEP1zdkfQzdN6LObM4MJLtiaw", "Village Makeover Settings", folder_id)
    share_result = share_sheet(drive_service, new_config_sheet)
    
    config_sheet_data = get_config_sheet_contents(new_config_sheet)
    d = {}
    key_column_index = config_sheet_data[0].index("key")
    value_column_index = config_sheet_data[0].index("value")
    for row in config_sheet_data[1:]:
        d[row[key_column_index]] = row[value_column_index]
        
    new_docids={}
    for i in range(0,len(sheet_docids)):
        title=sheet_docids[i][0:sheet_docids[i].rfind("_")]
        copy_result = copy_sheet(drive_service, d[sheet_docids[i]], title, folder_id)
        share_sheet(drive_service, copy_result)
        new_docids[sheet_docids[i]] = copy_result
        
    change_result = update_config_sheet(new_config_sheet, json_data['clientID'], json_data['clientSecret'], new_docids)
    
    return flask.Response(json.dumps({'status': 'ok', 'configDocid': new_config_sheet, 'folderID': folder_id}), content_type='application/json')

def copy_sheet(drive_service, docid, title, parent_id):
    file_copy = {'title': title}
    file_copy['parents'] = [{'id': parent_id}]
    try:
        result = drive_service.files().copy(fileId=docid, body = file_copy).execute()
        return result["id"]
    except errors.HttpError, error:
        print error
        result = 'error'

    return result

def share_sheet(drive_service, docid):
    new_permission = {
      'value': conf['client_email'],
      'type': 'user',
      'role': 'writer'
    }
    try:
        return drive_service.permissions().insert(fileId=docid, body=new_permission).execute()
    except errors.HttpError, error:
        print 'An error occurred: %s' % error
        result = 'error'

    return result

def get_config_sheet_contents(docid):
    credentials = SignedJwtAssertionCredentials(conf['client_email'], conf['private_key'], scope)
    login = gspread.authorize(credentials)
    return login.open_by_key(docid).sheet1.get_all_values()

def update_config_sheet(docid, client_id, client_secret, new_docids):
    credentials = SignedJwtAssertionCredentials(conf['client_email'], conf['private_key'], scope)
    login = gspread.authorize(credentials)
    work_sheet = login.open_by_key(docid).sheet1
    work_sheet_data = work_sheet.get_all_values()
    value_column_index = work_sheet_data[0].index("value")
    value_column_index = value_column_index + 1
    client_id_cell = work_sheet.find("clientID")
    client_secret_cell = work_sheet.find("clientSecret")
    work_sheet.update_cell(client_id_cell.row, value_column_index, client_id)
    work_sheet.update_cell(client_secret_cell.row, value_column_index, client_secret)
    
    for i in range(0,len(sheet_docids)):
        docid_cell=work_sheet.find(sheet_docids[i])
        work_sheet.update_cell(docid_cell.row, value_column_index, new_docids[sheet_docids[i]])
        
    return "ok"