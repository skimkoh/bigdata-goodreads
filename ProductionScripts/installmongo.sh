#!/bin/bash
cd ~
sudo apt-get update
sudo apt install unzip


wget -c https://istd50043.s3-ap-southeast-1.amazonaws.com/meta_kindle_store.zip -O meta_kindle_store.zip
unzip meta_kindle_store.zip
rm -rf *.zip


wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
sudo apt-get -y install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# sudo systemctl enable mongod
# sudo service mongod restart

echo "setting mongo config"
sudo sed -i "s/.*bindIp.*/  bindIp: 0.0.0.0/" /etc/mongod.conf
sudo service mongod restart

echo "importing json file into mongodb"
mongoimport --db mongo_database --collection kindle_metadata --file meta_Kindle_Store.json --legacy

mongo <<EOF
use mongo_database
db.createCollection('logs')
quit()
EOF

echo "Finished setting up MongoDB server"

#sudo cat /var/log/mongodb/mongod.log  

# sudo service mongod stop 
# sudo apt-get purge mongodb-org* 
# sudo rm -r /var/log/mongodb 
# sudo rm -r /var/lib/mongodb