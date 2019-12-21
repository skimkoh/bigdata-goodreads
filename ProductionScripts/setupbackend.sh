#!/bin/bash

cd ~
sudo apt-get update

sudo apt-get -y install nginx 
sudo apt-get -y install gunicorn3

echo "Setting up nginx"
sudo chmod o+rw /etc/nginx/sites-enabled

ipaddress=$(curl http://checkip.amazonaws.com)


cat > /etc/nginx/sites-enabled/flaskapp <<EOF 
server {
        listen 80;
        server_name $ipaddress;

        location / {
                proxy_pass http://127.0.0.1:8000;
        }
}
EOF

sudo service nginx restart

cd bigdata-goodreads/backend
sudo apt-get -y install python3-venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
screen -d -m gunicorn -w 1 application

echo "backend server is up"

