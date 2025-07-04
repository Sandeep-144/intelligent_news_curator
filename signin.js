document.getElementById('signinForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const messageElem = document.getElementById('message');

  try {
    const response = await fetch('http://localhost:5501/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      messageElem.style.color = 'green';
      messageElem.textContent = 'Signin successful! Redirecting...';

      // ✅ Set localStorage BEFORE redirecting
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', username);

      setTimeout(() => window.location.href = 'index.html', 1500);
    } else {
      messageElem.style.color = 'red';
      messageElem.textContent = data.message || 'Signin failed.';
    }
  } catch (err) {
    console.error('Signin error:', err);
    messageElem.style.color = 'red';
    messageElem.textContent = 'Server error. Please try again.';
  }
});
