#!/bin/bash
./synclibs.sh
./compile.sh
REPLACEMENT_VALUE=$(git rev-parse HEAD)
sed -i.bak "s/\(head *: *\).*/\1$REPLACEMENT_VALUE/" config.yaml
rm config.yaml.bak
gcloud app deploy app-pipelines.yaml --version=1-8 --promote