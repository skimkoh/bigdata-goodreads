# bigdata-goodreads

### ZekeBook

50.043 Database and Big Data Project

Group Members: An Guo, Chelsea, Danial, Hang Wee, Seu Kim, Xiang Hao 

## Frontend

#### Required features:
* See some reviews
  * You can see reviews of a book by clicking on a specific book. Books can be found at pathnames `/catalog`, `/search` and the home page itself. This will redirect you to the `/info` page, where you can see the book information and the reviews. 
* Add a new book
  * You can add a new book by going to the pathname `/search`, which can be directed from the home page via the left-hand side menu bar under 'Search'. When adding a new book, you can add a screenshot of the book (which will show whether it succeeded via the top right hand green tick) with the book title, the price and some description. This will redirect you back to `/search` after a successful addition. __Note that all inputs cannot take in messages with singe/double quotation marks.__
* Add a new review
  * You can add a new review of a book at the pathname `/info` by clicking on a book. The review section is located after the book details section, where you can click on the right-hand side 'Add a New Review' button to add. __Note that all inputs cannot take in messages with singe/double quotation marks.__
  
#### Additional features:
* Home Page
  * Carousel with Recently Added Books. This will give you the latest books added. 
* Search function (under `/search`)
  * Search bar (top right) that is able to search through 'Book Title', 'Price' and 'Description'
  * Filter columns (top right) that are shown
* Catalog
  * See all books. You can filter books by categories.
* Edit Reviews
   * Edit reviews that are just posted. __Note that all inputs cannot take in messages with singe/double quotation marks.__
* Delete Books and Reviews
   * You can delete books/reviews via the red button next to the book/reviews.
* Sort Reviews for a Particular Book
  * Sort reviews by 'Latest', 'Most Stars' and 'Helpful'. 
* Rating Summary
  * Gives percentage of ratings (according to stars).


## Backend

### Production Backend:

#### Requirements:
* Flask (Webserver)
* MongoDB (Logs)
* MongoDB (Kindle Metadata)
* MySQL (Amazon Kindle Reviews)

#### Added features:
* Edit Books/Reviews
  * PUT API 
* Delete Books/Reviews
  * DELETE API
 * Query Books by Categories
 * GET API that allows you to retrieve more than 1 Categories specified
* Query most Recently Added Books
  * GET Newly Added Books
 
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
  * Summary: retrieve 'mean', 'variance', 'min', 'max', etc... 
  
  
  
 
 
 
 
# Instructions to set up:
## Setup Production System
* Make sure you have awscli and the following python3 libraries installed: boto3 and fabric(version 2).
* In ProductionScripts directory, run `./launch_production_system.sh  <aws_access_key_id> <aws_secret_access_key>\<ec2 instance type>`
* This script will create and setup the backend, frontend, mysql, mongo instances. Their public DNS can be found in `ec2InstancesProductionSystem.txt` file.

## Setup Hadoop and Spark Cluster
`./launch_analytics_system.sh`

## ETL Script 
Initialised when the "Analyse" button is pressed. This will automatically start the transfer of data from the MySQL and MongoDB instances to HDFS for analysis.

## Run analytics script 
`./spark_analysis.sh`

  
  
