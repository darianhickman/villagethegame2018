# Install google-cloud-sdk
if [ ! -d ${HOME}/google-cloud-sdk/bin ]
then
	curl https://dl.google.com/dl/cloudsdk/release/install_google_cloud_sdk.bash | bash
fi
export PATH=${PATH}:${HOME}/google-cloud-sdk/bin
# Install ige and node packages
if [ ! -d ige/server ]  
then
	curl -OL https://github.com/Irrelon/ige/archive/v1.5.5@2014-09-29-merge.tar.gz
	tar -zxvf v1.5.5@2014-09-29-merge.tar.gz
	mv ige-1.5.5-2014-09-29-merge ige
    rm v1.5.5@2014-09-29-merge.tar.gz
fi
cd ige/server
npm install
cd ../..
# Install libraries
./synclibs.sh
# Generate copiled game scripts
./compile.sh
SERVICE_ACCOUNT=village-service-account
CONFIG_DOCID="1r7LKoEI-1kFhSnH75XwEP1zdkfQzdN6LObM4MJLtiaw"
echo "Type the project name you will be working on, followed by [ENTER]:"
read CORE_PROJECT
echo "Use default config sheet[y/n]:"
read USER_CHOICE
if [ $USER_CHOICE == "n" ] || [ $USER_CHOICE == "N" ]
then
    CONFIG_DOCID="copy-default"
fi
gcloud auth login
gcloud config set project $CORE_PROJECT
gcloud service-management enable plus.googleapis.com
gcloud service-management enable appengine.googleapis.com
gcloud service-management enable storage-component.googleapis.com
gcloud service-management enable datastore.googleapis.com 
gcloud service-management enable script.googleapis.com
gcloud service-management enable storage-api.googleapis.com
gcloud service-management enable drive.googleapis.com
if [ $USER_CHOICE == "n" ] || [ $USER_CHOICE == "N" ]
then
    gcloud iam service-accounts create $SERVICE_ACCOUNT --display-name "Village Makeover Service Account"
    gcloud iam service-accounts keys create ./client-secret2.json --iam-account=$SERVICE_ACCOUNT@$CORE_PROJECT.iam.gserviceaccount.com
fi
python create_config_yaml.py $CONFIG_DOCID $(git rev-parse HEAD)