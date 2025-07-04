async function fetchNews() {
    const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=fb382c0335cf459f9125dbd9ac3e4c8e');
    const data = await response.json();
    const newsContainer = document.getElementById('news');

    data.articles.forEach(article => {
        // Check if the article has an image
        const articleImage = article.urlToImage ? article.urlToImage : 'default-image-url.jpg'; // Provide a default image if none exists

        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <div class="news-image">
                <img src="${articleImage}" alt="${article.title}" />
            </div>
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Read more</a>
            <button onclick="addToInterestedNews('${article.title}')">Add to Interested</button>
        `;
        newsContainer.appendChild(articleElement);
    });
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// Function to fetch and display news based on the search query
async function fetchNews(query) {
    const apiKey = 'fb382c0335cf459f9125dbd9ac3e4c8e'; // Replace with your API key
    const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);
    const data = await response.json();
    const newsContainer = document.getElementById('news');
    
    // Clear previous results
    newsContainer.innerHTML = '';

    if (data.articles && data.articles.length > 0) {
        data.articles.forEach(article => {
            // Use a fallback image if no image is provided
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
                <button onclick="addToInterestedNews('${article.title}')">Add to Interested</button>
            `;
            newsContainer.appendChild(articleElement);
        });
    } else {
        newsContainer.innerHTML = "<p>No results found for your search.</p>";
    }
}

// Function to add news to the interested list (you can keep your existing logic)
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

document.querySelectorAll('.category').forEach(categoryElement => {
    categoryElement.addEventListener('click', () => {
        const category = categoryElement.getAttribute('data-category');

        // Fetch and display news for the selected category
        fetchNews(category);

        // Also add to user's interested categories
        // addToInterestedNews(category);
    });
});

// Call fetchNews function if on the index page
if (window.location.pathname === '/index.html') {
    fetchNews();
}

// Fetch user's interested news on profile page
function fetchInterestedNews() {
    const interestedNews = JSON.parse(localStorage.getItem('interestedNews'));
    const interestedNewsContainer = document.getElementById('interestedNews');

    interestedNews.forEach(title => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `<h3>${title}</h3>`;
        interestedNewsContainer.appendChild(articleElement);
    });
}

// Call fetchInterestedNews function if on the profile page
if (window.location.pathname === '/profile.html') {
    fetchInterestedNews();
}

// Search button event listener
searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query); // Fetch news based on the search query
});

// Optional: Trigger search when pressing Enter key
searchText.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        const query = searchText.value;
        if (query) fetchNews(query);
    }
});

// Sign Out Functionality
function signOut() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'signin.html'; // Redirect to sign-in page after sign-out
}