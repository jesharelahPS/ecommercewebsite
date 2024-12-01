document.addEventListener('DOMContentLoaded', () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    displayFavorites(favorites);
});

function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorite items yet!</p>';
        return;
    }

    favorites.forEach(product => {
        const favoriteItem = document.createElement('div');
        favoriteItem.classList.add('favorite-item');
        favoriteItem.innerHTML = `
            <div><img src="${product.photos.front}" alt="${product.name}" class="product-image"></div>
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button class="favorite-button" onclick="removeFromFavorites(${product.id})">Remove</button>
        `;
        favoritesList.appendChild(favoriteItem);
    });
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(product => product.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(favorites);
    alert(`Removed product with ID ${productId} from favorites.`);
}
