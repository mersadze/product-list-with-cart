const products = document.querySelector('.products');
const cartBox = document.querySelector('.cart-box');
const cartList = document.querySelector('.cart-list');
const emptyCart = document.querySelector('.empty-cart');
const checkoutButton = document.querySelector('.checkout');
const newOrderButton =  document.querySelector('.modal-button');

let cart = {};
let cartItems = 0;
let totalPrice = 0;

function updateCartDisplay() {
    const cartItemCount = Object.keys(cart).length;

    if (cartItemCount === 0) {
        emptyCart.style.display = 'block';
        cartBox.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartBox.style.display = 'block';
    }

    cartList.innerHTML = '';
    cartItems = 0;
    totalPrice = 0;

    for (const itemName in cart) {
        const quantity = cart[itemName].quantity;
        const itemPrice = cart[itemName].price;
        const subtotal = itemPrice * quantity;

        cartItems += quantity;
        totalPrice += subtotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-details">
                <label>${itemName}</label>
                <div class="item-price">
                    <span class="item-quantity">${quantity}x</span>
                    <span class="price-per-unit">@ $${itemPrice.toFixed(2)}</span>
                    <span class="total-price">$${subtotal.toFixed(2)}</span>
                </div>
            </div>
            <div>
                <button data-name="${itemName}" class="remove-cart">
                    <img src="./assets/images/icon-remove-item.svg" alt="Remove item">
                </button>
            </div>
        `;
        cartList.appendChild(cartItem);
    }

    document.querySelector('#itemCount').innerText = cartItems;
    document.querySelector('#totalPrice').innerText = totalPrice.toFixed(2);

    cartList.querySelectorAll('.remove-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemName = event.currentTarget.dataset.name;
            if (cart[itemName]) {
                cart[itemName].quantity -= 1;
                if (cart[itemName].quantity <= 0) {
                    delete cart[itemName];
                }
                updateCartDisplay();
                updateProductButtons();
            }
        });
    });
}

function updateProductButtons() {
    products.querySelectorAll('.product').forEach(product => {
        const itemImage = product.querySelector('img');
        const itemName = product.querySelector('h2').innerText;
        const addBtn = product.querySelector('.add-to-cart');
        const removeBtn = product.querySelector('.remove-item');
        const quantitySpan = removeBtn.querySelector('.quantity');

        if (cart[itemName]) {
            addBtn.style.display = 'none';
            removeBtn.style.display = 'flex';
            quantitySpan.innerText = cart[itemName].quantity;
            itemImage.style.border = '2px solid #c73a0f';
        } else {
            addBtn.style.display = 'flex';
            removeBtn.style.display = 'none';
            quantitySpan.innerText = '0';
            itemImage.style.border = 'none';
        }
    });
}

products.querySelectorAll('.product').forEach(product => {
    const itemName = product.querySelector('h2').innerText;
    const itemPrice = parseFloat(product.querySelector('.product-price').innerText.replace('$', ''));
    const productCategory = product.getAttribute('data-category');
    const addBtn = product.querySelector('.add-to-cart');
    const removeBtn = product.querySelector('.remove-item');

    removeBtn.style.display = 'none';

    addBtn.addEventListener('click', e => {
        e.preventDefault();
        if (!cart[itemName]) {
            cart[itemName] = { quantity: 0, price: itemPrice, category: productCategory };
        }
        cart[itemName].quantity += 1;

        updateCartDisplay();
        updateProductButtons();
    });

    removeBtn.querySelector('.decrement').addEventListener('click', e => {
        e.preventDefault();
        if (cart[itemName]) {
            cart[itemName].quantity -= 1;
            if (cart[itemName].quantity <= 0) {
                delete cart[itemName];
            }
            updateCartDisplay();
            updateProductButtons();
        }
    });

    removeBtn.querySelector('.increment').addEventListener('click', e => {
        e.preventDefault();
        if (!cart[itemName]) {
            cart[itemName] = { quantity: 0, price: itemPrice };
        }
        cart[itemName].quantity += 1;

        updateCartDisplay();
        updateProductButtons();
    });
});

checkoutButton.addEventListener('click', () => {
    const modal = document.querySelector('.modal');
    modal.style.display = 'flex';

    const modalCartList = modal.querySelector('.list');
    modalCartList.innerHTML = '';

    let total = 0;

    for (const itemName in cart) {
        const quantity = cart[itemName].quantity;
        const itemPrice = cart[itemName].price;
        const category = cart[itemName].category;
        const subtotal = itemPrice * quantity;

        total += itemPrice * quantity;

        const modalCartItem = document.createElement('div');
        modalCartItem.className = 'item';

        for (const product of products.querySelectorAll('.product')) {
            if (product.getAttribute('data-category') === category) {
                const thumbnailPath = getThumbnailName(category);
                modalCartItem.innerHTML = `
                    <div class="item-left">
                        <div class="item-img">
                            <img src="${thumbnailPath}" alt="${itemName}">
                        </div>
                        <div class="details">
                            <div class="title">
                                <label>${itemName}</label>
                            </div>
                            <div class="prices">
                                <span class="quantity">${quantity}x</span>
                                <span class="price">@ $${itemPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="total-per-item">
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                `;
                break;
            }
        }
        modalCartList.appendChild(modalCartItem);
    }

    const modalTotalHtml = `
        <div class="total-modal">
            <p>Order Total</p>
            <h2>$${total.toFixed(2)}</h2>
        </div>
    `;
    modalCartList.insertAdjacentHTML('beforeend', modalTotalHtml);
});

newOrderButton.addEventListener('click', () => {
    cart = {};
    updateCartDisplay();
    updateProductButtons();
    const modal = document.querySelector('.modal');
    const modalCartList = modal.querySelector('.list');

    modal.style.display = 'none';
    modalCartList.innerHTML = '';
});

function getThumbnailName(categoryName) {
    if (!categoryName) return null;
    categoryName = String(categoryName).toLowerCase();
    const thumbnailPath = `./assets/images/image-${categoryName}-thumbnail.jpg`;
    return thumbnailPath;
}