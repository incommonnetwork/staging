#!/bin/bash

echo "ansible-playbook ./api/playbook.yml --extra-vars \"host=$1 incommon_NODE_ENV=$2 incommon_POSTGRES_CONNECTION=$3\""