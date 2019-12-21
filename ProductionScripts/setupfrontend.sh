#!/bin/bash

cd ~
sudo apt-get update
sudo apt-get -y install nodejs npm

sudo apt-get -y install nginx 

echo "Setting up nginx"
sudo chmod o+rw /etc/nginx/sites-enabled

ipaddress=$(curl http://checkip.amazonaws.com)


cat > /etc/nginx/sites-enabled/frontendapp <<EOF 
server {
        listen 80;
        server_name $ipaddress;

        location / {
                proxy_pass http://127.0.0.1:3000;
        }
}
EOF

sudo service nginx restart


cd bigdata-goodreads

base_api=$(sed -n 's/backend \(.*\)/\1/p' < ec2InstancesProductionSystem.txt | awk '{print $2}')
echo ${base_api}
sed -i "s/.*BASE_API.*/export const BASE_API= '$base_api'/" frontend/src/App.js
echo "Updated app to point to correct backend server"


cd frontend
echo "installing NPM dependencies, please wait a few minutes"
npm install  #npm install dosen't work on t2.micro. Not enough RAM
screen -d -m npm start


echo "frontend server is up"