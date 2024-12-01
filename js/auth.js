// Event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the user exists
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        alert('Login successful!');
        if (rememberMe) {
            // Save user data to localStorage if "Remember Me" is checked
            localStorage.setItem('rememberedUser', JSON.stringify({ email: user.email }));
        }
        // Redirect to the homepage or user dashboard
        window.location.href = 'index.html';
    } else {
        alert('User not found. Please register first.');
    }
});

// Check for remembered user on page load
window.onload = function () {
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    const loginForm = document.querySelector('.form-box.login');
    
    if (rememberedUser) {
        // Hide the login form
        loginForm.style.display = 'none';

        // Create a message and a button to redirect to the homepage
        const message = document.createElement('p');
        message.textContent = 'You are already logged in.';
        message.style.fontSize = '18px';
        message.style.marginBottom = '20px';

        const redirectButton = document.createElement('button');
        redirectButton.textContent = 'Go to Homepage';
        redirectButton.classList.add('redirect-btn'); // Add a class for styling
        redirectButton.addEventListener('click', function () {
            window.location.href = 'index.html'; // Redirect to homepage
        });

        // Append the message and button to the login form container
        loginForm.parentElement.appendChild(message);
        loginForm.parentElement.appendChild(redirectButton);
    }
};


// Event listener for register form submission
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    // Create a new user object
    const newUser = {
        fullName: fullName,
        email: email,
        password: password // Be sure to hash passwords in production
    };

    // Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('User already exists. Please use a different email.');
        return;
    }

    // Add the new user to the array and save it to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('User registered successfully!');
    // Reset the form and switch to the login form
    this.reset();
    document.querySelector('.form-box.signup').style.display = 'none';
    document.querySelector('.form-box.login').style.display = 'flex';
});

// Event listeners for switching between login and register forms
document.getElementById('showRegister').addEventListener('click', function () {
    document.querySelector('.form-box.login').style.display = 'none';
    document.querySelector('.form-box.signup').style.display = 'flex';
});

document.getElementById('showLogin').addEventListener('click', function () {
    document.querySelector('.form-box.signup').style.display = 'none';
    document.querySelector('.form-box.login').style.display = 'flex';
});

// Redirect to social login
document.getElementById('googleLogin').addEventListener('click', function () {
    window.location.href = 'https://accounts.google.com/signin';
});

document.getElementById('facebookLogin').addEventListener('click', function () {
    window.location.href = 'https://www.facebook.com/login/';
});