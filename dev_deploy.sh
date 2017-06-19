# Script partially based on the bitbucketpipelines logic.  

# Should do all the download dependencies thing?  
# Yes. 
export APP_VERSION=3
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
export CLOUDSDK_CORE_PROJECT=mygoolgeappproject
export CONFIG_DOCID=1r7LKoEI-1kFhSnH75XwEP1zdkfQzdN6LObM4MJLtiaw

if [ ! -f /usr/local/bin/node ]
then
	brew install node
fi

if [ ! -e ${HOME}/google-cloud-sdk/bin ]
then
	SDK_VERSION=127.0.0
	SDK_FILENAME=google-cloud-sdk-${SDK_VERSION}-linux-x86_64.tar.gz
	curl -O -J https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${SDK_FILENAME}
	tar -zxvf ${SDK_FILENAME} --directory ${HOME}
	export PATH=${PATH}:${HOME}/google-cloud-sdk/bin
fi
        # Install ige
if [ ! -e ige/server ]  
then
	curl -OL https://github.com/Irrelon/ige/archive/v1.5.5@2014-09-29-merge.tar.gz
	tar -zxvf v1.5.5@2014-09-29-merge.tar.gz
	mv ige-1.5.5-2014-09-29-merge ige
fi


cd ige/server
npm install
cd ../..

if [ ! -e ${HOME}/google_appengine/appcfg.py ]
then    
	# Install Google App Engine SDK

	GAE_PYTHONPATH=${HOME}/google_appengine
	export PYTHONPATH=${PYTHONPATH}:${GAE_PYTHONPATH}
	python fetch_gae_sdk.py $(dirname "${GAE_PYTHONPATH}")
	echo "${PYTHONPATH}" && ls ${GAE_PYTHONPATH}
fi

        # Install app & dev dependencies, deploy
pip --quiet install -r requirements.txt -t libs/

if [ ! -e client-secret.json]
then
	cp villagegamedev-7ef4100fcad6.json ./client-secret.json
fi

python create_config_yaml.py ${CONFIG_DOCID}
cd ige
node server/ige.js -deploy ../client
cd ..
./compressjs.sh client/js/plugins/log4javascript.js client/js/plugins/howler.js client/js/plugins/usehowler.js client/js/gameClasses/loaders/GameConfig.js client/deploy/gameStart.min.js
gcloud auth activate-service-account --key-file client-secret.json
gcloud --quiet --verbosity=error app deploy app-pipelines.yaml --version=${APP_VERSION} --promote
