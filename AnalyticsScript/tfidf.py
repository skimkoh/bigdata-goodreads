from pyspark.sql import SparkSession
from pyspark.sql import functions as f
from pyspark import SparkContext
import re
from pyspark.ml.feature import HashingTF, IDF, Tokenizer, CountVectorizer

def stringify(vector):
        words = ""
        for (i, tfidf) in zip(vector.indices, vector.values):
            temp = vocab[i]+":"+str(float(tfidf))+", "                                               words+=temp
        return words[:-2]

with open("masternode_publicDNS.txt", "r") as file:
    master = file.read()

sc = SparkSession.builder.master("spark://" + master +   ":7077").getOrCreate()
reviews=sc.read.options(header=True).csv("hdfs://" + master + ":9000/inputs/mysql_data.csv")

filled_reviews = reviews.na.fill({'reviewText': ''})
token = Tokenizer(inputCol="reviewText", outputCol="words")
data_words = token.transform(filled_reviews)
cv = CountVectorizer(inputCol="words", outputCol="rawFeatures")
model = cv.fit(data_words)
dataFeatures = model.transform(data_words)
idf = IDF(inputCol="rawFeatures", outputCol="features")
idf_model = idf.fit(dataFeatures)
rescaled_data = idf_model.transform(dataFeatures)

vocab = model.vocabulary

answer = rescaled_data.select('reviewerID','asin','features').rdd.map(lambda row: [row[0],row[1],stringify(row[2])])
final = sc.createDataFrame(answer, ['reviewerID','asin', 'tfidf'])
final = final.where(f.length(f.col("reviewerID")) < 30)
final.write.csv("hdfs://"+ master  + ":9000/inputs/tfidf")
sc.stop()