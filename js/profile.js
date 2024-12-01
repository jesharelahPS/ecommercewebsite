function loadUserProfile() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserEmail = sessionStorage.getItem('currentUserEmail'); // Assuming you save the logged-in user's email

    const user = users.find(user => user.email === currentUserEmail);
    if (user) {
        document.getElementById('profile-info').innerHTML = `
            <h3>Name: ${user.fullName}</h3>
            <h3>Email: ${user.email}</h3>
            <button onclick="editProfile()">Edit Profile</button>
        `;
    }
}

function editProfile() {
    // Logic to edit the user profile
    alert('Edit profile functionality to be implemented.');
}

// Call this function to load user profile when the page loads
loadUserProfile();