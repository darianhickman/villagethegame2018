#!/bin/sh
set -e
cd ige
node server/ige.js -deploy ../client
cd ..
./compressjs.sh client/js/plugins/log4javascript.js client/js/plugins/howler.js client/js/plugins/usehowler.js client/js/gameClasses/loaders/GameConfig.js client/deploy/gameStart.min.js