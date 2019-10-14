from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import yaml 
app = Flask(__name__)

# configure db
db = yaml.load(open('db.yaml'))
app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORD'] = db['mysql_password']
app.config['MYSQL_DB'] = db['mysql_db']

mysql = MySQL(app)

@app.route('/', methods = ['GET', 'POST'])
def index():
      if request.method == 'POST':
            # fetch form
            addReview = request.form
            asin = addReview['asin']
            helpful = addReview['helpful']
            overall = addReview['overall']
            reviewText = addReview['reviewText']
            reviewTime = addReview['reviewTime']
            reviewerID = addReview['reviewerID']
            reviewerName = addReview['reviewerName']
            summary = addReview['summary']
            unixReviewTime = addReview['unixReviewTime']
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO kindle_review (asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime) VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)", (asin, helpful, overall, reviewText, reviewTime, reviewerID, reviewerName, summary, unixReviewTime))
            mysql.connection.commit()
            cur.close()
            return 'success'
      return render_template('new_review.html')

@app.route('/reviews')
def Home(): 
  cur = mysql.connection.cursor()
  cur.execute("SELECT reviewerName, summary from kindle_review WHERE id > '12000'")
  fetchdata = cur.fetchall()
  cur.close()
  # return render_template('home.html', value = fetchdata)
  return jsonify(fetchdata)


# @app.route('/delete')
# def delete_reviews():
#       asin 

if __name__ == '__main__':
      app.run(debug=True)

