document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('productId'), 10);

    if (productId) {
        fetchProductData(productId);
    }
});

function fetchProductData(productId) {
    fetch('../json/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);

            if (product) {
                displayProductDetails(product);
            } else {
                console.error('Product not found');
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
}

function displayProductDetails(product) {
    // Display product details in the DOM
    const imageElement = document.querySelector('.display-product-image');
    imageElement.src = product.photos.front;
    imageElement.alt = product.name;

    const nameElement = document.querySelector('.display-product-name');
    nameElement.innerText = product.name;

    const priceElement = document.querySelector('.display-product-price');
    priceElement.innerText = `$${product.price.toFixed(2)}`;

    // Populate size options
    const sizeSelection = document.querySelector('.display-size-selection');
    sizeSelection.innerHTML = `
        <label><input type="radio" name="size" value="S"> Small</label>
        <label><input type="radio" name="size" value="M"> Medium</label>
        <label><input type="radio" name="size" value="L"> Large</label>
        <label><input type="radio" name="size" value="XL"> Extra Large</label>
    `;

    // Optionally, set initial quantity to 0
    const quantitySpan = document.querySelector('.display-quantity-selector span');
    quantitySpan.innerText = 0;

    // Add event listeners for the quantity buttons
    const decrementButton = document.querySelector('.display-decrement');
    const incrementButton = document.querySelector('.display-increment');

    decrementButton.addEventListener('click', () => {
        let currentQuantity = parseInt(quantitySpan.innerText, 10);
        if (currentQuantity > 0) {
            quantitySpan.innerText = currentQuantity - 1;
        }
    });

    incrementButton.addEventListener('click', () => {
        let currentQuantity = parseInt(quantitySpan.innerText, 10);
        quantitySpan.innerText = currentQuantity + 1;
    });

    // Set up the "Add to Favorites" and "Add to Cart" buttons
    const addToFavoritesButton = document.querySelector('.add-to-favorites');
    const addToCartButton = document.querySelector('.add-to-cart');

    addToFavoritesButton.addEventListener('click', () => addToFavorites(product.id));
    addToCartButton.addEventListener('click', () => addToCart(product.id));
}


function addToFavorites(productId) {
    fetch('../json/products.json')
        .then(response => response.json())
        .then(products => {
            const favoriteProduct = products.find(product => product.id === productId);

            if (favoriteProduct) {
                // Store favoriteProduct using favorites.js
                addToFavoritesInFavoritesJS(favoriteProduct);
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
}

function addToFavoritesInFavoritesJS(favoriteProduct) {
    if (typeof addFavoriteItem !== 'function') {
        console.error("The `addFavoriteItem` function is not defined in favorites.js.");
        return;
    }

    const result = addFavoriteItem(favoriteProduct); // Assuming `addFavoriteItem` in `favorites.js` handles favorite data.
    if (result.success) {
        alert(`${favoriteProduct.name} has been added to your favorites!`);
    } else if (result.error === "duplicate") {
        alert(`${favoriteProduct.name} is already in your favorites.`);
    }
}


function addToCart(productId) {
    const selectedSize = document.querySelector(`input[name="size"]:checked`);
    const quantitySpan = document.querySelector('.display-quantity-selector span');
    const quantity = parseInt(quantitySpan.innerText);

    if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
    }

    if (quantity === 0) {
        alert("Please select at least one item.");
        return;
    }

    fetch('../json/products.json')
        .then(response => response.json())
        .then(products => {
            const cartProduct = products.find(product => product.id === productId);

            if (cartProduct) {
                const cartItem = {
                    id: cartProduct.id,
                    name: cartProduct.name,
                    price: cartProduct.price,
                    size: selectedSize.value,
                    quantity: quantity,
                };

                // Store cartItem using auth.js
                addToCartInAuth(cartItem);
                alert(`${quantity} item(s) of size ${selectedSize.value} for ${cartProduct.name} added to cart!`);
                updateCartCount();
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
}

function addToCartInAuth(cartItem) {
    if (typeof addCartItem !== 'function') {
        console.error("The `addCartItem` function is not defined in auth.js.");
        return;
    }

    addCartItem(cartItem); // Assuming `addCartItem` in `auth.js` handles cart data.
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}
