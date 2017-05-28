# Script partially based on the bitbucketpipelines logic.  

# Should do all the download dependencies thing?  
# Yes. 
export APP_VERSION=3
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
export CLOUDSDK_CORE_PROJECT=villagegamedev
export CONFIG_DOCID=1j3dS
#export GOOGLE_API_KEY=AIzaSyCK2vENT9QCIjXnv2Ic5GLUQZDbuht19AQ
# killing client secret bits for now. 
#export  GOOGLE_CLIENT_SECRET={   "type": "service_account",   "project_id": "villagethegame111",   "private_key_id": "43c3bb4e764f2ebcfbc67df8df7b3872bab92d1c",   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCtoNZTw/4+aViu\nwhXka+1mbiNsat2RVWzfq3cqJdGDr4NFuAyzVMVkELMyt48dr5NYNMPVMfRqRgtA\n82LxeLGzuEzsKE9Zyylc+ZM8Nk2nb/NGYodmOxB7GCXfDyKiEGRvBnVOfpwyZL2+\nHGSQryvCwczMFQMCrOhvOzEHSluDjK75uqzHL0aU+3SLHhZDA94kBM4svLdc+QDX\nUqAemnwnMmn4Slwj71DItZiJzkiX3rxdPhxrmeCc0LTpfz1lQp7DpKsby5H44gD+\nGYEUpzW+O13M+bS8MlB+EBJdP8Tj39oybunsbMUt9iSLtsuJXG7Wmdan2n2RJ4pc\n8p00k4MrAgMBAAECggEAYpAB+u0wn5dHy3TL3q5RxqrRGxOTEZRvyIzaiaeMRvfU\nSjiPpSGDKCm+wBSpfo2T1Cen35eLCuUWMFm5miAMqFv/9rNvUCbfJTNcHHsrG9iW\nPidie2seEPKFVRmPbHZnvQrqfpOq8YR0nb4abHO0IMvJCTUIT3V+QN5WF7BjQMol\nhkGNIZpnVQYizE33TJbmjTAjbnZEWCunFj/rp4cgJnM8w6WcmDUh6xOkYfy2Trxw\nY6PmTfJeSoki1GbcyuO8/TwLoaCCxq+WwNSjyhnkgT423TVR7BG0KXfIY/DnpBex\ntO2z9Dwez2lNfi5Vp+7zQpy3eCKsQfxxIvxnGJBmyQKBgQDWzTJ2LLhfHoFigszY\nQXY59ftAGEImRiQhYtCFDz3YkVb8sJp+Y98lALOykpiibEPy4JKg3nRC5mNG4ZCe\nuFqsRKVItUZgRFhAUmnrVgvxnPUWK1MrRf42RV3uqBd7IYgj6jL4w7pzs7YHeTUH\nACxMFMUr5hOiFh7O3k2mZhXX3wKBgQDO7gXm6Vp1Njzpb/2Y9R4eB+kyDBJy/OrG\nGwaHCwV4elDoVG9onstroVMUQgATw3lEnjarGCmZP1UKWoWgK5r0aMOp5eWFVKdG\n1HC4okPiilTKnIziEVzUmL5Y/06JWRfHz6OPNn/p1i6aBigJ11VQOVmP+flq3aSt\n7dHV6jRuNQKBgQCkrzIPFH5Ovw6nvmzbKGVCTutQ2shsm747soz4VxUto1Cz75qj\naGK+9ejP8kD/1k3KOo9wst0kJYrb3ziH2AP8q6ylMAZC7GNU/VqjyZbiqVnmo1Ti\niok6hrhbr5hBGRZNotNtknKzHodi93TGZ0WPFyWMYJuQ27DHHf0epIn+tQKBgQCj\n5zjZi+BQkyNwK3qNWyn903pMX++FEPvM6r8i3AH7SbcoLykHjy/FEsVBeH2jKeO2\nDDN1FfBtKBLt3oGVOrTD/u9sdWJ1V3YfzklylWR73eIHkjStI9+JrWqoB6FnfSAu\n7jK5TwvGZhYHffTcxqkWoDZmqjN7CBBWi9b3P0lEOQKBgQCIbXYCL47fvyCzxONP\n16MSSxA8zN1zpe115xiXzemhQaqha/eyS1o+RU6FzRSF4+VEhUlfXZd6K88/4uVC\nNJaYW7zuKtUmSsyD4noYJTQWBnKMNyaAilC/9rK4iTy4bW9dzgx6E0JTZnZItgE8\nrbDW6ukLowxNN71eIc2toOyuDg==\n-----END PRIVATE KEY-----\n",   "client_email": "prodservice@villagethegame111.iam.gserviceaccount.com",   "client_id": "115500050378562241526",   "auth_uri": "https://accounts.google.com/o/oauth2/auth",   "token_uri": "https://accounts.google.com/o/oauth2/token",   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/prodservice%40villagethegame111.iam.gserviceaccount.com" }
            # Google Cloud SDK is pinned for build reliability. Bump if the SDK complains about deprecation.
if [! -e ${HOME}/google-cloud-sdk/bin ]
then
	SDK_VERSION=127.0.0
	SDK_FILENAME=google-cloud-sdk-${SDK_VERSION}-linux-x86_64.tar.gz
	curl -O -J https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${SDK_FILENAME}
	tar -zxvf ${SDK_FILENAME} --directory ${HOME}
	export PATH=${PATH}:${HOME}/google-cloud-sdk/bin
fi
        # Install ige
if [! -e ige/server]  
then
	curl -OL https://github.com/Irrelon/ige/archive/v1.5.5@2014-09-29-merge.tar.gz
	tar -zxvf v1.5.5@2014-09-29-merge.tar.gz
	mv ige-1.5.5-2014-09-29-merge ige
fi


cd ige/server
npm install
cd ../..
        # Install Google App Engine SDK
# GAE_PYTHONPATH=${HOME}/google_appengine
# export PYTHONPATH=${PYTHONPATH}:${GAE_PYTHONPATH}
# python fetch_gae_sdk.py $(dirname "${GAE_PYTHONPATH}")
# echo "${PYTHONPATH}" && ls ${GAE_PYTHONPATH}
        # Install app & dev dependencies, deploy
pip --quiet install -r requirements.txt -t libs/
echo "key = '${GOOGLE_API_KEY}'" > api_key.py
#echo ${GOOGLE_CLIENT_SECRET} > client-secret.json
python create_config_yaml.py ${CONFIG_DOCID}
cd ige
node server/ige.js -deploy ../client
cd ..
./compressjs.sh client/js/plugins/log4javascript.js client/js/plugins/howler.js client/js/plugins/usehowler.js client/js/gameClasses/loaders/GameConfig.js client/deploy/gameStart.min.js
gcloud auth activate-service-account --key-file client_secret_964969600719-g623osulept6ucc8e9nr0d15mpl5ft3n.apps.googleusercontent.com.json
gcloud --quiet --verbosity=error app deploy app-pipelines.yaml --version=${APP_VERSION} --promote