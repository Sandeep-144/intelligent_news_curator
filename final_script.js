document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is already logged in
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (loggedIn) {
        document.getElementById('signin').style.display = 'none'; // Hide sign-in button
        document.getElementById('signup').style.display = 'none'; // Hide sign-up button
        document.getElementById('profile').style.display = 'block'; // Show profile button
        document.getElementById('logout').style.display = 'block'; // Show logout button
    } else {
        document.getElementById('signin').style.display = 'block'; // Show sign-in button
        document.getElementById('signup').style.display = 'block'; // Show sign-up button
        document.getElementById('profile').style.display = 'none'; // Hide profile button
        document.getElementById('logout').style.display = 'none'; // Hide logout button
    }

    // Sign Up Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;

            // Save user data in local storage
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            localStorage.setItem('interestedNews', JSON.stringify([])); // Initialize interested news
            alert('Sign Up successful! You can now Sign In.');
            window.location.href = 'signin.html'; // Redirect to sign-in page
        });
    }

    // Sign In Form Submission
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', function(event) {
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
    }

    // Sign Out Functionality
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.clear();
            window.location.href = 'index.html'; // Redirect to sign-in page after sign-out
        });
    }

    // Call fetchNews function if on the index page
    if (window.location.pathname.includes('index.html')) {
        fetchNews();
    }

    // Function to add news to interested list
    function addToInterestedNews(category) {
        const username = localStorage.getItem('username');
    
        if (!username) {
            alert("Please sign in to add interests.");
            return;
        }
    
        fetch('http://localhost:5501/add-interest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, category })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`${category} category added to your interests.`);
            } else {
                alert(data.message || 'Category already exists or error occurred.');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to connect to server. Try again later.');
        });
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
    if (window.location.pathname.includes('profile.html')) {
        fetchInterestedNews();
    }

    // Handle search input
    const searchButton = document.getElementById("search-button");
    const searchText = document.getElementById("search-text");

    searchButton.addEventListener("click", () => {
        const query = searchText.value;
        if (query) {
            fetchNews(query);
        }
    });

    // Navbar toggle functionality
    function toggleNavbar() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    }

    // Trending button functionality
    document.querySelector('.trending-btn')?.addEventListener('click', () => {
        window.location.href = 'trending.html'; // Redirect to trending news page
    });

});

const API_KEY = 'fb382c0335cf459f9125dbd9ac3e4c8e';

// Function to fetch and display news based on the selected category
async function fetchNews(category) {
    const endpoint = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${API_KEY}`;
    const newsContainer = document.getElementById('news');

    // Show a loading message while fetching data
    newsContainer.innerHTML = '<p>Loading news...</p>';

    try {
        const response = await fetch(endpoint);

        // Check if the response is valid
        if (!response.ok) throw new Error('Failed to fetch news');

        const data = await response.json();
        newsContainer.innerHTML = ''; // Clear existing news

        // Check if articles are found
        if (data.articles && data.articles.length > 0) {
            data.articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'news-article';
                articleElement.style.border = '1px solid #ccc';
                articleElement.style.padding = '10px';
                articleElement.style.margin = '10px 0';

                articleElement.innerHTML = `
                    <h3>${article.title}</h3>
                    <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" alt="${article.title}" style="width: 100%; max-height: 200px; object-fit: cover;" />
                    <p>${article.description || 'No description available.'}</p>
                    <a href="${article.url}" target="_blank">Read more</a>
                `;
                newsContainer.appendChild(articleElement);
            });
        } else {
            newsContainer.innerHTML = '<p>No news found for this category.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>';
    }
}

// Add event listeners to category buttons
document.querySelectorAll('.category').forEach(categoryElement => {
    categoryElement.addEventListener('click', () => {
        const category = categoryElement.getAttribute('data-category');
        fetchNews(category); // Fetch news for the selected category
    });
});

// Optionally, load the default category when the page loads
window.onload = () => {
    fetchNews('general'); // Fetch World news by default
};

document.getElementById('trending-link').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    fetchTrendingNews(); // Call the function to fetch and display trending news
});

async function fetchTrendingNews() {
    const apiKey = 'fb382c0335cf459f9125dbd9ac3e4c8e'; // Replace with your News API key
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const data = await response.json();
    const newsContainer = document.getElementById('news'); // Make sure you have a container with id 'news'

    // Clear previous news
    newsContainer.innerHTML = '';

    if (data.articles && data.articles.length > 0) {
        data.articles.forEach(article => {
            // Fallback image if no image exists
            const articleImage = article.urlToImage ? article.urlToImage : 'default-image-url.jpg';

            const articleElement = document.createElement('div');
            articleElement.className = 'news-article';
            articleElement.innerHTML = `
                <div class="news-image">
                    <img src="${articleImage}" alt="${article.title}" />
                </div>
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(articleElement);
        });
    } else {
        newsContainer.innerHTML = '<p>No trending news found.</p>';
    }
}