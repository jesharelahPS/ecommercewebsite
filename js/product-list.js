let cartCount = 0; // Track the number of items in the cart
let favorites = []; // Array to hold favorite items

document.addEventListener('DOMContentLoaded', () => {
    fetch('../json/products.json') // Ensure the path to your JSON file is correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
            setupFilters(products);
        })
        .catch(error => console.error('Error fetching product data:', error));

    // Update the cart count on page load
    updateCartCount();
});

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear the existing product list

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div><img src="${product.photos.front}" alt="${product.name}" class="product-image"></div>
            <h3 class="product-name">${product.name}</h3>
            <div class="price-quantity-container">
                <p class="product-price">$${product.price.toFixed(2)}</p>

                <!-- Quantity Selector -->
                <div class="quantity-selector">
                    <button onclick="decrementQuantity(${product.id})">-</button>
                    <span id="quantity-${product.id}">0</span>
                    <button onclick="incrementQuantity(${product.id})">+</button>
                </div>
            </div>
            
            <!-- Size Selection -->
            <div class="size-selection">
                <label><input type="radio" name="size-${product.id}" value="S"> S</label>
                <label><input type="radio" name="size-${product.id}" value="M"> M</label>
                <label><input type="radio" name="size-${product.id}" value="L"> L</label>
                <label><input type="radio" name="size-${product.id}" value="XL"> XL</label>
            </div>
            
            
            <button class="add-to-favorites" onclick="addToFavorites(${product.id})">Add to Favorites</button>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Bag</button>
        `;
        productList.appendChild(productCard);
    });
}

function incrementQuantity(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityElement.innerText, 10);
    quantityElement.innerText = currentQuantity + 1;
}

function decrementQuantity(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityElement.innerText, 10);
    if (currentQuantity > 0) {
        quantityElement.innerText = currentQuantity - 1;
    }
}



function setupFilters(products) {
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    const categoryRadios = document.querySelectorAll('.sidebar input[type="radio"]');
    const typeCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');

    // Display initial price range value
    priceDisplay.innerText = `Max Price: $${priceRange.value}`;

    // Filter by price range
    priceRange.addEventListener('input', () => {
        priceDisplay.innerText = `Max Price: $${priceRange.value}`;
        filterProducts(products, priceRange.value);
    });

    // Filter by categories using radios
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            filterProducts(products, priceRange.value);
        });
    });

    // Filter by types using checkboxes
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filterProducts(products, priceRange.value);
        });
    });
}

function filterProducts(products, maxPrice) {
    const selectedCategory = document.querySelector('.sidebar input[type="radio"]:checked')?.value;
    const selectedTypes = Array.from(document.querySelectorAll('.sidebar input[type="checkbox"]:checked')).map(input => input.value);

    const filteredProducts = products.filter(product => {
        const priceCheck = product.price <= maxPrice;
        const categoryCheck = selectedCategory === 'all' || product.category === selectedCategory;
        const typeCheck = selectedTypes.length === 0 || selectedTypes.includes(product.type); // Adjust this based on your JSON structure

        return priceCheck && categoryCheck && typeCheck;
    });

    displayProducts(filteredProducts);
}


function addToFavorites(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    fetch('../json/products.json')
        .then(response => response.json())
        .then(products => {
            const favoriteProduct = products.find(product => product.id === productId);

            if (favoriteProduct) {
                // Check if the item is already in favorites
                if (!favorites.some(item => item.id === productId)) {
                    favorites.push(favoriteProduct);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    alert(`${favoriteProduct.name} has been added to your favorites!`);
                } else {
                    alert(`${favoriteProduct.name} is already in your favorites.`);
                }
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
}


function addToCart(productId) {
    const selectedSize = document.querySelector(`input[name="size-${productId}"]:checked`);
    const quantitySpan = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantitySpan.innerText);

    if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
    }

    if (quantity === 0) {
        alert("Please select at least one item.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

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
                quantity: quantity
            };

            const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize.value);
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += quantity; // Update quantity if item exists
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${quantity} item(s) of size ${selectedSize.value} for ${cartProduct.name} added to cart!`);
            updateCartCount();
        }
    })
    .catch(error => console.error('Error fetching product data:', error));

}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}


