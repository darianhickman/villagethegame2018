import sys
import json
import os

config_docid_name   = '1S5eP0MIKbgEFHOo5WJ_LXujMYqbUzUyxLo2Acqz73Ic'
commit_head         = 'ca29860dfe4e58bdb59c9e27b488b55dba9d4ddf'
client_secret_file_name = 'villagethegame111-7c4fefc51ff2.json'
# if config_docid_name == 'copy-default':
#     client_secret_file_name = 'client-secret2.json'
# else:
#     client_secret_file_name = 'client-secret.json'
#
with open(client_secret_file_name) as client_secret_file:
    client_secret_data = json.load(client_secret_file)

with open('config.yaml', 'w') as outfile:
    outfile.write('spreadsheet:\n')
    outfile.write('  config_docid: "' + config_docid_name + '"\n')
    outfile.write('  private_key_id: ' + json.dumps(client_secret_data["private_key_id"]) + '\n')
    outfile.write('  private_key: ' + json.dumps(client_secret_data["private_key"]) + '\n')
    outfile.write('  client_email: ' + json.dumps(client_secret_data["client_email"]) + '\n')
    outfile.write('  client_id: ' + json.dumps(client_secret_data["client_id"]) + '\n')
    outfile.write('  type: "service_account"\n')
    outfile.write('commit:\n')
    outfile.write('  head: "' + commit_head + '"')
    
# if config_docid_name == 'copy-default':
#     os.remove('client-secret2.json')