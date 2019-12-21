# bigdata-goodreads

### ZekeBook

50.043 Database and Big Data Project

Group Members: An Guo, Chelsea, Danial, Hang Wee, Seu Kim, Xiang Hao 

# Instructions to set up:
## Setup Production System
* Make sure you have awscli and the following python3 libraries installed: boto3 and fabric(version 2).
* In ProductionScripts directory, run `./launch_production_system.sh  <aws_access_key_id> <aws_secret_access_key> <ec2 instance type>`
* This script will create and setup the backend, frontend, mysql, mongo instances. Their public DNS can be found in `ec2InstancesProductionSystem.txt` file.

## Setup Hadoop and Spark Cluster 
* (Note: Time taken to set up 2 node cluster 
* In AnalyticsScripts directory, run `./launch_analytics_system.sh <number of nodes in cluster> <ec2 instance type>`
* e.g. `./launch_analytics_system.sh 4 t2-medium`
* The Master node DNS is found in masternode_publicDNS.txt and the Slave nodes is found in datanodes_publicDNS.txt
## ETL Script
run `./etl.sh` to extract, transform and load the data from the MySQL and MongoDB instances to HDFS required for analysis.

## Run Analytics Script 
To run analytics tasks (Pearson correlation between price and average review length,  term frequency inverse document frequency metric on the review text and price summaries), run:
* `./spark_analysis.sh`

## To view results from analytics scripts 
From your local machine, ssh into master node through the command in the AnalyticsScripts directory:
##
`sudo ssh -i ../zeke.pem ubuntu@<publicDNS_masternode>` 
(To find the public DNS of the master node, copy-paste the public DNS from /AnalyticsScripts/masternode_publicDNS.txt)
##
Once inside, to view the results:
* `cd`
* For correlation results: `hdfs dfs -cat /inputs/correlation/part-00000`
* For price summary (extra analytics task) results: `hdfs dfs -cat /inputs/summary/part-00000`
* For tf-idf results, they are split into 6 parts in the hdfs inputs/tfidf/ directory, to view the results, first list the names of the output files saved: `hdfs dfs -ls /inputs/tfidf`. Drag and copy paste the desired filename into the following command: `hdfs dfs -cat /inputs/tfidf/<filename>`


# Frontend

#### Required features:
* See some reviews
  * You can see reviews of a book by clicking on a specific book. Books can be found at pathnames `/catalog`, `/search` and the home page itself. This will redirect you to the `/info` page, where you can see the book information and the reviews. 
* Add a new book
  * You can add a new book by going to the pathname `/search`, which can be directed from the home page via the left-hand side menu bar under 'Search'. When adding a new book, you can add a screenshot of the book (which will show whether it succeeded via the top right hand green tick) with the book title, the price and some description. This will redirect you back to `/search` after a successful addition.
* Add a new review
  * You can add a new review of a book at the pathname `/info` by clicking on a book. The review section is located after the book details section, where you can click on the right-hand side 'Add a New Review' button to add. 
  
#### Additional features:
* Home Page
  * Carousel with Recently Added Books. This will give you the latest books added. 
* Search function (under `/search`)
  * Search bar (top right) that is able to search through 'Book Title', 'Price' and 'Description'
  * Filter columns (top right) that are shown
* Catalog
  * See all books. You can filter books by categories.
* Edit Reviews
   * Edit reviews that are just posted. 
* Delete Books and Reviews
   * You can delete books/reviews via the red button next to the book/reviews.
* Sort Reviews for a Particular Book
  * Sort reviews by 'Latest', 'Most Stars' and 'Helpful'. 
* Rating Summary (under `/info`)
  * Gives percentage of ratings (according to stars)


# Backend

### Production Backend:

#### Requirements:
* Flask (Webserver)
* MongoDB (Logs)
* MongoDB (Kindle Metadata)
* MySQL (Amazon Kindle Reviews)

#### Added features:
This file contains the codes needed for the API calls, which can be found under /backend/app/routes.py. The APIs that we have implemented in our projects include the following, grouped according to the different HTTP methods:

* (GET method) 
  * Search for the first 100 books.
  * Search for a book using its 'asin'.
  * Search for the latest books by querying for the last 50 books.
  * Search for books by their category.
  * Search for a review using its 'id'.
  * Search for all reviews for a book using 'asin'.
###
* (POST method) 
  * Upload a new book.
  * Post a review for a book.
###
* (PUT method) 
  * Update details of a book.
  * Update a review of a book.
###
* (DELETE method) 
  * Remove a book using its 'asin'.
  * Delete reviews of a book.
###
* As well as error hanlders for invalid inputs.
 
### Analytics System:

#### Requirements:
* ETL Script
  * Transfers data from production system into HDFS
* Spark Analytics
  * Correlation: Pearson correlation between price and average review length (with MapReduce)
  * TF-IDF: compute Term Frequency Inverse Document Frequency metric on review text
* Run on 2,4,8-node clusters

#### Added Features:
* Spark Analytics:
  * Summary: retrieve 'mean', 'variance', 'min', 'max' as well as 'percentile' of all the prices of the books. 
  
# Production Scripts
Contains the bash scripts needed to set up the MySQL, MongoDB instances on AWS as well as the frontend and backend codes needed to get our project up and running on a new machine.
