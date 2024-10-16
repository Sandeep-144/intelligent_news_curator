// Fetch live news and display on index.html
async function fetchNews() {
    try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=12b895e41eb4434b925f3c85c9dd4089');
        const data = await response.json();
        const newsContainer = document.getElementById('news');

        if (data.articles && data.articles.length > 0) {
            data.articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'news-article';
                articleElement.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                    <button onclick="addToInterestedNews('${article.title}')">Add to Interested</button>
                `;
                newsContainer.appendChild(articleElement);
            });
        } else {
            newsContainer.innerHTML = "<p>No news articles available.</p>";
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Call fetchNews function if on the index page
if (window.location.pathname === '/index.html') {
    fetchNews();
}

// Check if the user is already logged in
if (localStorage.getItem('loggedIn') === 'true') {
    document.getElementById('signin').style.display = 'none'; // Hide sign in button
    document.getElementById('signup').style.display = 'none'; // Hide sign up button
    document.getElementById('profile').style.display = 'block'; // Show profile button
}

// Sign Up Form
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    // Save user data in local storage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.setItem('interestedNews', JSON.stringify([])); // Initialize interested news
    alert('Sign Up successful! You can now Sign In.');
    window.location.href = 'signin.html'; // Redirect to sign in page
});

// Sign In Form
document.getElementById('signinForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    const username = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;

    // Retrieve saved user data from local storage
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    // Validate user credentials
    if (username === savedUsername && password === savedPassword) {
        localStorage.setItem('loggedIn', 'true'); // Set login status
        window.location.href = 'index.html'; // Redirect to index page
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

// Function to add news to interested list
function addToInterestedNews(title) {
    let interestedNews = JSON.parse(localStorage.getItem('interestedNews')) || [];
    if (!interestedNews.includes(title)) {
        interestedNews.push(title);
        localStorage.setItem('interestedNews', JSON.stringify(interestedNews));
        alert(`${title} has been added to your interested news.`);
    } else {
        alert(`You have already added ${title} to your interested news.`);
    }
}

// Fetch user's interested news on profile page
function fetchInterestedNews() {
    const interestedNews = JSON.parse(localStorage.getItem('interestedNews')) || [];
    const interestedNewsContainer = document.getElementById('interestedNews');

    if (interestedNews.length > 0) {
        interestedNews.forEach(title => {
            const articleElement = document.createElement('div');
            articleElement.className = 'news-article';
            articleElement.innerHTML = `<h3>${title}</h3>`;
            interestedNewsContainer.appendChild(articleElement);
        });
    } else {
        interestedNewsContainer.innerHTML = "<p>No interested news articles yet.</p>";
    }
}

// Call fetchInterestedNews function if on the profile page
if (window.location.pathname === '/profile.html') {
    fetchInterestedNews();
}

// Sign Out Functionality
function signOut() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'signin.html'; // Redirect to sign-in page after sign-out
}
