from pyspark.mllib.stat import Statistics
from pyspark import SparkContext
from pyspark.sql import SQLContext
import math
import pyspark.sql.functions as f

with open("masternode_publicDNS.txt", "r") as file:
    master = file.read()

sc = SparkContext("spark://" + master + ":7077", "test")
sqlContext = SQLContext(sc)

df2 = sqlContext.read.csv('hdfs://' + master + ':9000/inputs/asin_price.csv', header=True, inferSchema=True)
df3 = df2.select('price')
df3 = df3.summary()
df3.rdd.coalesce(1, True).saveAsTextFile('hdfs://' + master + ':9000/inputs/summary')