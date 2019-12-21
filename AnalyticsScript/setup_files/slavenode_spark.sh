echo "Entered Spark master node"

wget https://www-eu.apache.org/dist/spark/spark-2.4.4/spark-2.4.4-bin-hadoop2.7.tgz
echo "Spark binaries downloaded"

tar -xvf spark-2.4.4-bin-hadoop2.7.tgz
echo "Spark binaries unzipped"

rm -rf spark-2.4.4-bin-hadoop2.7.tgz
echo "Spark zip file removed"

sudo mv spark-2.4.4-bin-hadoop2.7 spark
echo "Spark folder renamed to spark"

cp hadoop/etc/hadoop/workers spark/conf/slaves
echo "Spark workers file moved to spark slaves file"

echo $SPARK_HOME

sudo apt -y install python3
echo "Python 3 installed"

sudo apt -y install python3-pip
echo "python pip-3 installed"

sudo pip3 install numpy
sudo pip3 --no-cache-dir install pyspark
echo "pyspark installed"

#Use pyspark with python3
echo "export PYSPARK_PYTHON=python3" | sudo tee -a /etc/profile
source /etc/profile
echo "pyspark configured for python3"

#To call slave 
NAMENODE_DNS=$(cat "/home/ubuntu/masternode_publicDNS.txt")
./spark/sbin/start-slave.sh spark://${NAMENODE_DNS}:7077
echo "Spark slave launched"