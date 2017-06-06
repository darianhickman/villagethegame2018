#!/usr/bin/env bash
SERVICE_ACCOUNT=villagegamedev
echo "Type the project name you will be working on, followed by [ENTER]:"
read CORE_PROJECT
echo "Type the main settings sheet docid, followed by [ENTER]:"
read CONFIG_DOCID
export PATH=${PATH}:${HOME}/google-cloud-sdk/bin
gcloud auth login
gcloud config set project $CORE_PROJECT
gcloud service-management enable plus.googleapis.com
gcloud service-management enable appengine.googleapis.com
gcloud service-management enable storage-component.googleapis.com
gcloud service-management enable datastore.googleapis.com 
gcloud service-management enable script.googleapis.com
gcloud service-management enable storage-api.googleapis.com
gcloud service-management enable drive.googleapis.com
gcloud iam service-accounts create $SERVICE_ACCOUNT --display-name "Village Makeover Service Account"
gcloud iam service-accounts keys create ./client-secret.json --iam-account=${SERVICE_ACCOUNT}@${SERVICE_ACCOUNT}.appspot.gserviceaccount.com
python create_config_yaml.py $CONFIG_DOCID $(git rev-parse HEAD)