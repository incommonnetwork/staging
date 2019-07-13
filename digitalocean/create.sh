#!/bin/sh

# $1 = droplet name
# $2 = md5 fingerprint of public key

doctl compute droplet create $1 --size 1gb --image ubuntu-18-04-x64 --region nyc1 --ssh-keys $2 --user-data-file ./setup.sh