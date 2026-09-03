#!/bin/sh

#Build ist am Gym Neufeld vom Deployment getrennt
#yarn build

if [ -z "$1" ] || [ -z "$2" ]; then
  exit 1
fi

SERVER="$1"
ROOT="$2"

ME=$(ssh ${SERVER} echo \$\{USER\})
ssh ${SERVER} sudo chown -R ${ME} ${ROOT}
rsync -av --delete dist/* ${SERVER}:${ROOT}
ssh ${SERVER} sudo chgrp -R adm ${ROOT}
ssh ${SERVER} sudo chmod -R g+w ${ROOT}
