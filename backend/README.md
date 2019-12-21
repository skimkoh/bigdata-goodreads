## Backend

In the project directory, you can run:

### `python run.py`

The data for reviews has been stored in a MySQL database while the book metadata has been stored in a Mongo database. Changes made to the production system can be seen from the logs that we have created to keep track of any changes made to the MySQL and MongoDB instances such as when a new book is added or when a review has been deleted.

Make sure database name and table name are correct.

## NOTES

This file contains the codes needed for the API calls, which can be found under /app/routes.py. The APIs that we have implemented in our projects include the following, grouped according to the different HTTP methods:

- (GET method) Search for the first 100 books.
- (GET method) Search for a book using its 'asin'.
- (GET method) Search for the latest books by querying for the last 50 books.
- (GET method) Search for books by their category.
- (GET method) Search for a review using its 'id'.
- (GET method) Search for all reviews for a book using 'asin'.
###
- (POST method) Upload a new book.
- (POST method) Post a review for a book.
###
- (PUT method) Update details of a book.
- (PUT method) Update a review of a book.
###
- (DELETE method) Remove a book using its 'asin'.
- (DELETE method) Delete reviews of a book.
###
- As well as error hanlders for invalid inputs.
