# Run create_analytics_instances.py python script to create instances for the cluster
python3 create_analytics_instances.py -k zeke -n $1 -t $2

#Write private key detail - the file name - into a private_key.pem
PRIVKEY_FILENAME="zeke.pem"
echo ${PRIVKEY_FILENAME}

#Distribute Key and public_dns details to master node
NAMENODE_DNS=$(cat "./masternode_publicDNS.txt")
sudo scp -o "StrictHostKeyChecking no" -i "../${PRIVKEY_FILENAME}" "../${PRIVKEY_FILENAME}" ubuntu@${NAMENODE_DNS}:/home/ubuntu/.ssh/
echo "Copied private key to MASTER node"

sudo scp -i "../${PRIVKEY_FILENAME}" "./masternode_publicDNS.txt" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
echo "Copied public_dns detail of masternode to MASTER node"
sudo scp -i "../${PRIVKEY_FILENAME}" "./datanodes_publicDNS.txt" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
echo "Copied public_dns details of datanodes to MASTER node"


#Distribute addon and config files
tar -czvf addon_files.tar.gz addon_files
tar -czvf hadoop_config_files.tar.gz hadoop_config_files
sudo scp -i "../${PRIVKEY_FILENAME}" "addon_files.tar.gz" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
echo "addon_files copied to MASTER node"
sudo scp -i "../${PRIVKEY_FILENAME}" "hadoop_config_files.tar.gz" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
echo "hadoop_config_files copied to MASTER node"


#Distribute files to worker nodes
datanode_file="./datanodes_publicDNS.txt"
while read line || [[ -n $line ]]
do
    echo "OPERATING on $line"
    
    noNewLine=${line//[$'\t\r\n']}
    echo $noNewLine

    sudo scp -o "StrictHostKeyChecking no"  -i "../${PRIVKEY_FILENAME}" "./masternode_publicDNS.txt" ubuntu@"$noNewLine":/home/ubuntu/
    echo "Copied public_dns detail of masternode to WORKER node"
    sudo scp -i "../${PRIVKEY_FILENAME}" "./datanodes_publicDNS.txt" ubuntu@"$noNewLine":/home/ubuntu/
    echo "Copied public_dns detail of datanodes to WORKER node"

    #Distribute addon and config files
    sudo scp -i "../${PRIVKEY_FILENAME}" "addon_files.tar.gz" ubuntu@"$noNewLine":/home/ubuntu/
    echo "addon files copied to WORKER node"
    sudo scp -i "../${PRIVKEY_FILENAME}" "hadoop_config_files.tar.gz" ubuntu@"$noNewLine":/home/ubuntu/
    echo "hadoop_config_files copied to WORKER node"

done <"$datanode_file"

#Hadoop Installation for worker/data nodes
while read line || [[ -n $line ]]
do
    noNewLine=${line//[$'\t\r\n']}

    sudo ssh -i "../${PRIVKEY_FILENAME}" -o "StrictHostKeyChecking no" ubuntu@"$noNewLine" "bash -s" < setup_files/datanode_hadoop.sh
    echo "Hadoop installed for worker node $noNewLine"
done <"$datanode_file"

#Hadoop Installation for master node
sudo ssh -i "../${PRIVKEY_FILENAME}" -o "StrictHostKeyChecking no" ubuntu@${NAMENODE_DNS} "bash -s" < setup_files/masternode_hadoop.sh
echo "Hadoop installed for master node ${NAMENODE_DNS}"

# Spark Installation for master node
sudo ssh -i "../${PRIVKEY_FILENAME}" -o "StrictHostKeyChecking no" ubuntu@${NAMENODE_DNS} "bash -s" <  setup_files/masternode_spark.sh
echo "Hadoop installed for master node ${NAMENODE_DNS}"

# Spark Installation for worker/data nodes
while read line || [[ -n $line ]]
do
    noNewLine=${line//[$'\t\r\n']}
    sudo ssh -i "../${PRIVKEY_FILENAME}" -o "StrictHostKeyChecking no" ubuntu@"$noNewLine" "bash -s" <  setup_files/slavenode_spark.sh
    echo "Hadoop installed for worker node $noNewLine"
done <"$datanode_file"

# SCP PySpark files
sudo scp -o "StrictHostKeyChecking no" -i "../${PRIVKEY_FILENAME}" "tfidf.py" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
sudo scp -o "StrictHostKeyChecking no" -i "../${PRIVKEY_FILENAME}" "correlation.py" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
sudo scp -o "StrictHostKeyChecking no" -i "../${PRIVKEY_FILENAME}" "price_summary.py" ubuntu@${NAMENODE_DNS}:/home/ubuntu/
