PRIVKEY_FILENAME="zeke.pem"
NAMENODE_DNS=$(cat "./masternode_publicDNS.txt")

sudo ssh -o "StrictHostKeyChecking no"  -i "../${PRIVKEY_FILENAME}" ubuntu@${NAMENODE_DNS} << EOF
    sudo pip3 install numpy
    python3 tfidf.py
    python3 correlation.py
    python3 price_summary.py

    hdfs dfs -get /inputs/correlation /home/ubuntu/
    hdfs dfs -get /inputs/summary /home/ubuntu/
    hdfs dfs -get /inputs/tfidf.csv /home/ubuntu/

EOF



