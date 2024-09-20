#!/bin/sh
yarn build
SERVER=web4-test.kinet.ch
ROOT=/srv/www/pensen2.gymkirchenfeld.ch/
ME=$(ssh ${SERVER} echo \$\{USER\})
ssh ${SERVER} sudo chown -R ${ME} ${ROOT}
rsync -av --delete dist/* ${SERVER}:${ROOT}
ssh ${SERVER} sudo chgrp -R adm ${ROOT}
ssh ${SERVER} sudo chmod -R g+w ${ROOT}
