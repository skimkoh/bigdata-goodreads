# bigdata-goodreads
50.043 Database and Big Data Project

## Frontend

#### Requirements:
* See some reviews
* Add new review
* Add a new book

#### Added features:
* Add image when adding new book
  * Green tick to show successful upload of image
* Home Page
  * Carousel with Recently Added Books
* Search function 
  * Search bar that searches through 'Book Title', 'Price' and 'Description'
  * Filter columns that are shown
* Catalog
  * Filter books by Categories
* Edit Reviews
   * Edit reviews that are just posted (Unable to handle quotation marks)
* Delete Books and Reviews
* Sort Reviews for a Particular Book
  * Sort reviews by 'Latest', 'Most Stars', 'Helpful'
* Rating Summary
  * Gives percentage of ratings (according to stars)


## Backend

### Production Backend:

#### Requirements:
* Webserver (Flask)
* MongoDB (Logs)
* MongoDB (Kindle Metadata)
* MySQL (Amazon Kindle Reviews)

#### Added features:
* Edit Books/Reviews
 * PUT API 
* Delete Books/Reviews
 * DELETE API
* Query Category
 * GET API that allows you to retrieve more than 1 Category specified
* Query most Recently Added Books
 * Filter Newly Added Books
 
### Analytics Backend:

#### Requirements:
* ETL Script
 * Saves data from production system and load into HDFS
* Spark Analytics
 * Correlation: Pearson correlation between price and average review length (with Mapreduce)
 * TF-IDF: compute Term Frequency Inverse DOcument Frequency metric on review text
* Run on 2,4,8-node clusters

#### Added Features:
* Spark Analytics:
 * Summary: retrive 'mean', 'variance', 'min', 'max', etc... 
