#!/bin/sh
yarn build
SERVER=pm.gymneufeld.site
ROOT=/var/www/pensen.gymneufeld.site
ME=$(ssh ${SERVER} echo \$\{USER\})
ssh ${SERVER} sudo chown -R ${ME} ${ROOT}
rsync -av --delete dist/* ${SERVER}:${ROOT}
ssh ${SERVER} sudo chgrp -R adm ${ROOT}
ssh ${SERVER} sudo chmod -R g+w ${ROOT}
