function toggleMenu() {
    const navItems = document.querySelectorAll('.nav-bar li');
    navItems.forEach(item => {
        item.classList.toggle('show'); // Toggle visibility of menu items
    });
}

function searchProducts() {
    const query = document.getElementById('searchInput').value;
    // Redirect to product list with the search query
    window.location.href = `product-list.html?search=${encodeURIComponent(query)}`;
}


