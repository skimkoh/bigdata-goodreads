from flask import Flask, render_template
from flask_mysqldb import MySQL
import yaml 
app = Flask(__name__)

# configure db
db = yaml.load(open('db.yaml'))
app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORd'] = ''
app.config['MYSQL_DB'] = db['mysql_db']

mysql = MySQL(app)

@app.route('/')
def Home(): 
  cur = mysql.connection.cursor()
  cur.execute("SELECT reviewerName from kindle_reviews WHERE overall = 4 limit 5")
  fetchdata = cur.fetchall()
  cur.close()

  return render_template('home.html', value = fetchdata)

if __name__ == '__main__':
      app.run(debug=True)

