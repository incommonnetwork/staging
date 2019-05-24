#!/bin/bash

ansible-playbook ./api/playbook.yml --extra-vars "incommon_host=$1 incommon_NODE_ENV=$2 incommon_POSTGRES_CONNECTION=$3"