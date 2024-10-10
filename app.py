from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Set a secret key for session management

# Dummy database to store user info (for demonstration purposes)
users_db = {}

# Route for the home page
@app.route('/')
def home():
    return render_template('index.html')

# Route for the signup page
@app.route('/templates/signup.html', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        city = request.form['city']
        state = request.form['state']
        pincode = request.form['pincode']

        # Hash the password for security
        hashed_password = generate_password_hash(password)

        # Store user information in the "database"
        users_db[email] = {
            'name': name,
            'password': hashed_password,
            'city': city,
            'state': state,
            'pincode': pincode
        }

        flash('Signup successful! You can now log in.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

# Route for the login page
@app.route('/templates/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = users_db.get(email)
        if user and check_password_hash(user['password'], password):
            session['user'] = user['name']  # Store user name in session
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials, please try again.', 'danger')
    
    return render_template('login.html')

# Route for the dashboard page
@app.route('/dashboard')
def dashboard():
    return f"Welcome to your dashboard, {session.get('user', 'Guest')}!"

if __name__ == '__main__':
    app.run(debug=True)
