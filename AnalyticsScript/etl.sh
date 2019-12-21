PRIVKEY_FILENAME="zeke.pem"
NAMENODE_DNS=$(cat "./masternode_publicDNS.txt")


while read line || [[ -n $line ]]
do
    set -- $line
    if [[ $1 == 'mysql' ]]; then
        echo $1
        echo $2
        sudo scp -o "StrictHostKeyChecking no" -i "../${PRIVKEY_FILENAME}" "../${PRIVKEY_FILENAME}" ubuntu@$2:/home/ubuntu/.ssh/
        echo "Copied private key to SQL node" 
sudo ssh -o "StrictHostKeyChecking no"  -i "../${PRIVKEY_FILENAME}" ubuntu@$2 <<EOF
    sudo mysql book_reviews -e "select * from kindle_reviews" -B | sed "s/'/\'/;s/\t/\",\"/g;s/^/\"/;s/$/\"/;s/\n//g" > mysql_data.csv
    echo "Done exporting MySQL Data"
    sudo scp -o "StrictHostKeyChecking no" -i "/home/ubuntu/.ssh/${PRIVKEY_FILENAME}" "/home/ubuntu/mysql_data.csv" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
EOF

        # echo "Copied SQL data to master node" 
    fi

    if [[ $1 == 'mongodb' ]]; then
        echo $1
        echo $2
        sudo scp -o "StrictHostKeyChecking no" -i "../${PRIVKEY_FILENAME}" "../${PRIVKEY_FILENAME}" ubuntu@$2:/home/ubuntu/.ssh/
        echo "Copied private key to MongoDB node"

sudo ssh -o "StrictHostKeyChecking no"  -i "../${PRIVKEY_FILENAME}" ubuntu@$2 <<EOF
    mongoexport --db=mongo_database --collection=kindle_metadata --type=csv -f asin,price > asin_price.csv
    echo "Done exporting Mongo Data"
    sudo scp -o "StrictHostKeyChecking no"  -i "/home/ubuntu/.ssh/${PRIVKEY_FILENAME}" /home/ubuntu/asin_price.csv ubuntu@${NAMENODE_DNS}:/home/ubuntu/
EOF
        # echo "Copied MongoDB data to master node" 
    fi

done <"../ProductionScripts/ec2InstancesProductionSystem.txt"

echo "done"

sudo ssh -o "StrictHostKeyChecking no"  -i "../${PRIVKEY_FILENAME}" ubuntu@${NAMENODE_DNS} << EOF
    hdfs dfsadmin -safemode leave
    hdfs dfs -mkdir /inputs
    hdfs dfs -put asin_price.csv /inputs
    hdfs dfs -put mysql_data.csv /inputs
EOF