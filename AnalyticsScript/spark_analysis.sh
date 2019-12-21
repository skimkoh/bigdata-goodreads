PRIVKEY_FILENAME="zeke.pem"
NAMENODE_DNS=$(cat "./masternode_publicDNS.txt")

sudo ssh -o "StrictHostKeyChecking no"  -i "../${PRIVKEY_FILENAME}" ubuntu@${NAMENODE_DNS} << EOF
    sudo pip3 install numpy
    python3 tfidf.py
    python3 correlation.py
    python3 price_summary.py

EOF



