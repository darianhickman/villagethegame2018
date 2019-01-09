from __future__ import unicode_literals
from google.appengine.api import memcache

import json
import gspread
import yaml
import logging
import os
import ftfy
try:
    from google.appengine.api import urlfetch
    from requests_toolbelt.adapters import appengine
    appengine.monkeypatch()
except ImportError:
    pass

from oauth2client.service_account import ServiceAccountCredentials

import httplib2
from apiclient import errors
from apiclient.discovery import build
import httplib, urllib
import time

local_config = yaml.load(open(os.path.join(os.path.dirname(__file__), '../config.yaml')))
logging.info(['configyaml', local_config])
is_login_necessary = False

# set the secret key.  keep this really secret:
# secret_key = 'C0Zf73j/4yX R~DHH!juN]LZX/,?SL'

session = None

scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

def memcached(name):
    def wrapper(func):
        def cacher():
            start_time = int(round(time.time() * 1000))
            ret = memcache.get(name)
            if ret:
                end_time = int(round(time.time() * 1000)) - start_time
                params = get_ga_params('memcache', 'get', name, end_time)
                send_ga_timing(params)
                return json.loads(ret)
            else:
                ret = func()
                memcache.set(name, json.dumps(ret))
                end_time = int(round(time.time() * 1000)) - start_time
                params = get_ga_params('memcache', 'set', name, end_time)
                send_ga_timing(params)
                return ret

        def remove():
            memcache.delete(name)

        cacher.remove_cache = remove

        return cacher

    return wrapper

def get_ga_params(category, variable, label, end_time):
    params = urllib.urlencode({
        'v': 1,
        'tid': 'UA-5656121-3',
        'cid': '123',
        't': 'timing',
        'utc': category,
        'utv': variable,
        'utt': end_time,
        'utl': label,
        'ua': 'Village Makeover'
    })
    return params

def send_ga_timing(params):
    connection = httplib.HTTPSConnection('www.google-analytics.com')
    connection.request('POST', '/collect', params)
    response = connection.getresponse()
    print response.status, response.reason
    connection.close()
    return response

def get_config_docid():
    conf = local_config['spreadsheet']
    config_docid = conf['config_docid']
    return config_docid

def get_commit_head():
    conf = local_config['commit']
    commit_head = conf['head']
    return commit_head

def login():
    credentials = ServiceAccountCredentials.from_json_keyfile_name('villagethegame111-7c4fefc51ff2.json', scope)

    return gspread.authorize(credentials)

def get_session():
    global session
    if not session:
        session = login()
    return session

def get_sheet(docid):
    try:
        return login().open_by_key(docid).sheet1.get_all_values()
    except Exception:
        logging.error(['requested spreadsheet docid: ', docid])
        raise

def copy_village_sheet(title):
    sheet_config = get_config()
    conf = local_config['spreadsheet']
    credentials = ServiceAccountCredentials.from_json_keyfile_name('villagethegame111-7c4fefc51ff2.json', scope)

    http = httplib2.Http()
    http = credentials.authorize(http)
    drive_service = build('drive', 'v2', http=http)
    file_copy = {'title': title}
    file_copy['parents'] = [{'id': sheet_config['driveFolderID']}]

    try:
        result = drive_service.files().copy(fileId=sheet_config['defaultVillageID'], body = file_copy).execute()
        return result["id"]
    except errors.HttpError, error:
        print error
        result = 'error'

    return result

def rename_village_sheet(village_docid,new_title):
    conf = local_config['spreadsheet']
    credentials = ServiceAccountCredentials.from_json_keyfile_name('villagethegame111-7c4fefc51ff2.json', scope)

    http = httplib2.Http()
    http = credentials.authorize(http)
    drive_service = build('drive', 'v2', http=http)

    file = drive_service.files().get(fileId=village_docid).execute()
    file['title'] = new_title
    updated_file = drive_service.files().update(fileId=village_docid,body=file).execute()
    return "success"

def delete_village_sheet(village_docid):
    conf = local_config['spreadsheet']
    credentials = ServiceAccountCredentials.from_json_keyfile_name('villagethegame111-7c4fefc51ff2.json', scope)

    http = httplib2.Http()
    http = credentials.authorize(http)
    drive_service = build('drive', 'v2', http=http)

    drive_service.files().delete(fileId=village_docid).execute()
    return "success"

def get_village_sheet(village_docid):
    data = get_sheet(village_docid)
    headers = data[0]
    items = []
    for row in data[1:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

def save_village_sheet(village_docid, data):
    current_spreadsheet = login().open_by_key(village_docid)
    current_worksheet = current_spreadsheet.sheet1
    current_row_count = current_worksheet.row_count
    new_row_count = len(data)

    #add rows if needed
    if(current_row_count - 1 < new_row_count):
        current_worksheet.add_rows(new_row_count - current_row_count + 1)
    #Select a range
    cell_list = current_worksheet.range('A2:H' + str(current_row_count))
    #clear existing values
    for cell in cell_list:
        cell.value = ""
    #fill cells with new values
    count = 0
    for i, val in enumerate(data):  #gives us a tuple of an index and value
        cell_list[0+count].value = val['id']    #use the index on cell_list and the val from cell_values
        cell_list[1+count].value = val['name']
        cell_list[2+count].value = val['x']
        cell_list[3+count].value = val['y']
        cell_list[4+count].value = val['w']
        cell_list[5+count].value = val['h']
        cell_list[6+count].value = val['buildStarted']
        cell_list[7+count].value = val['buildCompleted']
        count += 8

    # Update in batch
    current_worksheet.update_cells(cell_list)

    return "success"

def get_worksheet(sheet_docid,worksheet_name):
    try:
        sheet = login().open_by_key(sheet_docid)
        return sheet.worksheet(worksheet_name).get_all_values()
    except Exception:
        logging.error(['requested spreadsheet docid: ', sheet_docid])

@memcached('dropdown_menu')
def get_dropdown_menu():
    sheet_config = get_config()
    dropdown_menu_docid = sheet_config['dropdown_menu_docid']
    data = get_sheet(dropdown_menu_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('special_events')
def get_special_events():
    sheet_config = get_config()
    special_events_docid = sheet_config['special_events_docid']
    data = get_sheet(special_events_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('assets')
def get_assets():
    sheet_config = get_config()
    assets_docid = sheet_config['assets_docid']
    data = get_sheet(assets_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('problems')
def get_problems():
    sheet_config = get_config()
    problems_docid = sheet_config['problems_docid']
    data = get_sheet(problems_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('asset_bundle')
def get_asset_bundle():
    sheet_config = get_config()
    asset_bundle_docid = sheet_config['asset_bundle_docid']
    data = get_sheet(asset_bundle_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('messages')
def get_messages():
    sheet_config = get_config()
    messages_docid = sheet_config['messages_docid']
    data = get_sheet(messages_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('fsm')
def get_fsm():
    sheet_config = get_config()
    fsm_docid = sheet_config['game_fsm_docid']
    data = get_sheet(fsm_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('goals_data')
def get_goals_data():
    sheet_config = get_config()
    goals_docid = sheet_config['goals_docid']
    data = get_worksheet(goals_docid,"goals")
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

@memcached('goals_tasks')
def get_goals_tasks():
    sheet_config = get_config()
    goals_docid = sheet_config['goals_docid']
    data = get_worksheet(goals_docid,"tasks")
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items


@memcached('config')
def get_config():
    conf = local_config['spreadsheet']
    config_docid = conf['config_docid']
    logging.info(['config_docid', config_docid])
    logging.info(['config_url', "https://docs.google.com/spreadsheets/d/" + config_docid])
    data = get_sheet(config_docid)
    #data = ftfy.fix_text(data)
    d = {}
    key_column_index = data[0].index("key")
    value_column_index = data[0].index("value")
    for row in data[1:]:
        d[row[key_column_index]] = row[value_column_index]
    # add logging statement here
    logging.info(d)
    return d


def get_news_feed():
    sheet_config = get_config()
    news_feed_docid = sheet_config['news_feed_docid']
    data = get_sheet(news_feed_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items

def get_login_condition():
    return is_login_necessary

def get_secret_key():
    return local_config['spreadsheet']['private_key_id']

@memcached('catalog')
def get_catalog():
    sheet_config = get_config()
    catalog_docid = sheet_config['catalog_docid']
    data = get_sheet(catalog_docid)
    headers = data[0]
    items = []
    for row in data[2:]:
        if row and row[0]:
            items.append(dict(zip(headers, row)))
    return items
