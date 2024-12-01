document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];


    const discountInput = document.getElementById('discount-code');
    discountInput.addEventListener('blur', () => {
        calculateCartTotal(cart);
    });

    fetch('../json/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            displayCartItems(cart, products);
            calculateCartTotal(cart, products);
        })
        .catch(error => console.error('Error fetching product data:', error));
});

function displayCartItems(cart, products) {
    const cartItemsBody = document.getElementById('cart-items-body');
    cartItemsBody.innerHTML = '';

    cart.forEach(item => {
        const product = products.find(prod => prod.id === item.id);

        if (!product) {
            console.warn(`Product with ID ${item.id} not found in products.json`);
            return;
        }

        const cartRow = document.createElement('tr');
        cartRow.classList.add('cart-item');
        cartRow.innerHTML = `
            <td class="cart-item-image">
                <img src="${product.photos.front}" alt="${product.name}" class="cart-item-img" />
                <p class="cart-item-name">${product.name}</p>
            </td>
            <td class="cart-item-size">
                <select class="size-select" id="item-size-${item.id}">
                    <option value="Small" ${item.size === 'Small' ? 'selected' : ''}>Small</option>
                    <option value="Medium" ${item.size === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="Large" ${item.size === 'Large' ? 'selected' : ''}>Large</option>
                    <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                </select>
            </td>
            <td class="cart-item-quantity">
                <div class="quantity-control">
                    <input type="number" class="quantity-input" min="1" value="${item.quantity}" id="item-quantity-${item.id}" />
                </div>
            </td>
            <td class="cart-item-price">
                <p class="item-price" id="item-price-${item.id}">$${(item.quantity * product.price).toFixed(2)}</p>
            </td>
            <td class="cart-item-remove">
                <button class="item-remove" id="item-remove-${item.id}" data-id="${item.id}">🗑</button>
            </td>
        `;

        cartItemsBody.appendChild(cartRow);

    
        document.getElementById(`item-quantity-${item.id}`).addEventListener('change', (e) => {
            updateItemQuantity(cart, item.id, Number(e.target.value), products);
        });

        document.getElementById(`item-remove-${item.id}`).addEventListener('click', () => {
            removeFromCart(item.id);
        });
    });
}

function updateItemQuantity(cart, itemId, newQuantity, products) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));

    
        const product = products.find(prod => prod.id === itemId);
        const itemPrice = document.getElementById(`item-price-${itemId}`);
        itemPrice.innerText = `$${(newQuantity * product.price).toFixed(2)}`;

        calculateCartTotal(cart);
    }
}

function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));


    document.querySelector(`#item-remove-${itemId}`).closest('tr').remove();

    calculateCartTotal(cart);
}

function calculateCartTotal(cart) {
    let subtotal = 0;
    const shipping = 38.99;
    const discountCode = document.getElementById('discount-code').value.trim();
    let discount = 0;

    cart.forEach(item => {
        subtotal += item.quantity * item.price;
    });

    if (discountCode === 'SAVE10') {
        discount = 100;
    }

    const total = subtotal + shipping - discount;

    document.getElementById('subtotal-price').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping-price').innerText = `$${shipping.toFixed(2)}`;
    document.getElementById('voucher-price-subtract').innerText = `-$${discount.toFixed(2)}`;
    document.getElementById('total-price').innerText = `$${total.toFixed(2)}`;
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Check if the required fields are filled
    const cardNumber = document.getElementById('card-number').value.trim();
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const expiration = document.getElementById('expiration').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!cardNumber || !firstName || !lastName || !expiration || !cvv || !address) {
        alert("Please fill in all the required fields.");
        return;
    }

    const discountCode = document.getElementById('discount-code').value.trim();
    let discount = 0;
    if (discountCode === 'SAVE10') {
        discount = 100;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.quantity * item.price;
    });

    const shipping = 38.99;
    const total = subtotal + shipping - discount;

    alert(`Checkout Successful!\n\nTotal: $${total.toFixed(2)}`);

    localStorage.removeItem('cart');
    window.location.href = '../html/index.html';
}
