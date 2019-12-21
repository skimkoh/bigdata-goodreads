#Unzip the addon_files and hadoop_config_files
tar -xzvf addon_files.tar.gz
tar -xzvf hadoop_config_files.tar.gz
rm hadoop_config_files.tar.gz
rm addon_files.tar.gz
echo "addon_files and hadoop_config_files unzipped"

# Update your system
sudo apt-get update -y && sudo apt-get upgrade -y
echo "system updated"

# Install OpenJDK 8
sudo apt-get -y install openjdk-8-jdk
echo "JAVA 8 installed"
echo "JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre/" | sudo tee -a /etc/environment
source /etc/environment
echo $JAVA_HOME
echo "JAVA loaded in /etc/environment"

#Download and unzip hadoop in master node
wget https://archive.apache.org/dist/hadoop/common/hadoop-3.1.2/hadoop-3.1.2.tar.gz
tar -xzf hadoop-3.1.2.tar.gz
mv hadoop-3.1.2 hadoop
rm hadoop-3.1.2.tar.gz
echo "Hadoop downloaded and unzipped"

#Add Hadoop binaries to your path (make sure path file is correct)
cat ./addon_files/addon_.profile >> /home/ubuntu/.profile
source /home/ubuntu/.profile

#Add Hadoop to your PATH for the shell (make sure path file is correct)
cat ./addon_files/addon_.bashrc >> /home/ubuntu/.bashrc
source /home/ubuntu/.bashrc

#Edit the config files first
NAMENODE_DNS=$(cat "./masternode_publicDNS.txt")
sed -i "s/<namenodeIP>/${NAMENODE_DNS}/g" hadoop_config_files/core-site.xml
sed -i "s/<namenodeIP>/${NAMENODE_DNS}/g" hadoop_config_files/yarn-site.xml
cat "./datanodes_publicDNS.txt" > hadoop_config_files/workers

#Copy the config files over
cp hadoop_config_files/hadoop-env.sh /home/ubuntu/hadoop/etc/hadoop/hadoop-env.sh
cp hadoop_config_files/hdfs-site.xml /home/ubuntu/hadoop/etc/hadoop/hdfs-site.xml
cp hadoop_config_files/core-site.xml /home/ubuntu/hadoop/etc/hadoop/core-site.xml
cp hadoop_config_files/mapred-site.xml /home/ubuntu/hadoop/etc/hadoop/mapred-site.xml
cp hadoop_config_files/yarn-site.xml /home/ubuntu/hadoop/etc/hadoop/yarn-site.xml
cp hadoop_config_files/workers /home/ubuntu/hadoop/etc/hadoop/workers
