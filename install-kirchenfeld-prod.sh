#!/bin/sh
yarn build
SERVER=web4.kinet.ch
ROOT=/srv/www/pensen.gymkirchenfeld.ch/
ME=$(ssh ${SERVER} echo \$\{USER\})
ssh ${SERVER} sudo chown -R ${ME} ${ROOT}
rsync -av --delete dist/* ${SERVER}:${ROOT}
ssh ${SERVER} sudo chgrp -R adm ${ROOT}
ssh ${SERVER} sudo chmod -R g+w ${ROOT}
