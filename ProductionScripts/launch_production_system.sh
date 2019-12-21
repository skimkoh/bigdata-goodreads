#!/bin/bash

echo $1
echo $2

echo "setting up aws credentials"
aws configure set aws_access_key_id $1
aws configure set aws_secret_access_key $2
aws configure set default.region ap-southeast-1
if [ -e ../zeke.pem ]
then
    echo "keypair already created"
else

    aws ec2 create-key-pair --key-name zeke --query 'KeyMaterial' --output text > ../zeke.pem
fi

echo "running production_system script"
python3 production_system_script.py -k zeke -t $3

