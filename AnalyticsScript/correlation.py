from pyspark import SparkContext
from pyspark.sql import HiveContext
from pyspark.sql import SQLContext
import pyspark.sql.functions as f
from pyspark.sql.window import Window
import re
from pyspark import RDD
import math

with open("masternode_publicDNS.txt", "r") as file:
    master = file.read()

sc = SparkContext("spark://" + master + ":7077", "test")
sqlContext = SQLContext(sc)


df1 = sqlContext.read.csv('hdfs://' + master + ':9000/inputs/mysql_data.csv', header=True, inferSchema= True)
#df1 = sqlContext.read.csv('hdfs://ec2-3-1-83-253.ap-southeast-1.compute.amazonaws.com:9000/user/hadoop/mysqldata.csv', header=True, inferSchema= True)

df1 = df1.groupBy('asin').agg(f.mean(f.length(f.col('reviewText'))).alias('average_length'))

path2 = 'asin_price.json'

#df2 = sqlContext.read.json(path2)
df2 = sqlContext.read.csv('hdfs://' + master + ':9000/inputs/asin_price.csv', header=True, inferSchema=True)
#df2 = sqlContext.read.json('hdfs://ec2-3-1-83-253.ap-southeast-1.compute.amazonaws.com:9000/user/hadoop/kindle_meta_example.json')

df3 = df1.join(df2, df1.asin == df2.asin).select(df1['*'], df2['price'])

df3 = df3.select('price', 'average_length')

#df3 = df3.where(col('price').isNotNull())
df3 = df3.filter(df3.price. isNotNull())

n = df3.count()

df3list = df3.rdd.map(list)
#print(df3list)

df3flat = df3list.flatMap(lambda row: (
        ('p', row[0]),
        ('ar', row[1]),
        ('pp', row[0]*row[0]),
        ('aarr', row[1]*row[1]),
        ('par', row[0]*row[1])))

df3flatreduced = df3flat.reduceByKey(lambda  p, ar:p+ar).sortByKey()

datafin = df3flatreduced.take(5)

aarr = datafin[0][1]
ar = datafin[1][1]
p = datafin[2][1]
par = datafin[3][1]
pp = datafin[4][1]

num = par - (p * ar)/n
denom = math.sqrt(pp - (p*p)/n) * math.sqrt(aarr - (ar * ar)/n)
corr = num/denom

#print(corr)

final = sc.parallelize([corr])

final.coalesce(1, True).saveAsTextFile('hdfs://' + master + ':9000/inputs/correlation')

print('success! output returned to hadoop.')
