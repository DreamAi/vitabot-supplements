// Shopping cart functionality
document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('vitabotCart')) || [];
    const cartCount = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.closest('.product-card').querySelector('img').src;

            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            // Save to localStorage
            localStorage.setItem('vitabotCart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show success message
            if (window.showNotification) {
                window.showNotification(`${productName} added to cart!`, 'success');
            }

            // Add bounce animation to cart icon
            if (cartCount) {
                cartCount.classList.add('cart-bounce');
                setTimeout(() => {
                    cartCount.classList.remove('cart-bounce');
                }, 1000);
            }

            // Update button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = 'var(--success)';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Initialize cart count
    updateCartCount();

    // Cart page functionality
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        setupCartInteractions();
    }

    // Checkout page functionality
    if (window.location.pathname.includes('checkout.html')) {
        renderOrderSummary();
        setupCheckoutForm();
    }

    // Render cart items on cart page
    function renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <a href="products.html" class="btn">Continue Shopping</a>
                </div>
            `;
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        // Clear existing items
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());

        // Add cart header if it doesn't exist
        if (!cartItemsContainer.querySelector('.cart-header')) {
            const cartHeader = document.createElement('div');
            cartHeader.className = 'cart-header';
            cartHeader.innerHTML = `
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
            `;
            cartItemsContainer.prepend(cartHeader);
        }

        // Add each cart item
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-category">Health Supplement</div>
                    </div>
                </div>
                <div class="cart-item-price">R ${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">R ${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateCartSummary();
    }

    // Setup cart interactions
    function setupCartInteractions() {
        // Quantity decrease
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('decrease')) {
                const productId = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === productId);
                
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }
                
                updateCart();
            }
        });

        // Quantity increase
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('increase')) {
                const productId = e.target.getAttribute('data-id');
                const item = cart.find(item => item.id === productId);
                
                if (item) {
                    item.quantity += 1;
                }
                
                updateCart();
            }
        });

        // Remove item
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('cart-item-remove') || 
                e.target.closest('.cart-item-remove')) {
                const button = e.target.classList.contains('cart-item-remove') ? 
                    e.target : e.target.closest('.cart-item-remove');
                const productId = button.getAttribute('data-id');
                
                cart = cart.filter(item => item.id !== productId);
                updateCart();
                
                if (window.showNotification) {
                    window.showNotification('Item removed from cart', 'success');
                }
            }
        });

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    if (window.showNotification) {
                        window.showNotification('Your cart is empty!', 'error');
                    }
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
    }

    // Update cart summary
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 49.99;
        const total = subtotal + shipping;

        const cartSummary = document.querySelector('.cart-summary');
        if (!cartSummary) return;

        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="cart-totals">
                <div class="cart-total-line">
                    <span>Subtotal</span>
                    <span>R ${subtotal.toFixed(2)}</span>
                </div>
                <div class="cart-total-line">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'FREE' : 'R ' + shipping.toFixed(2)}</span>
                </div>
                <div class="cart-total-line total">
                    <span>Total</span>
                    <span>R ${total.toFixed(2)}</span>
                </div>
            </div>
            <button class="checkout-btn">Proceed to Checkout</button>
        `;

        // Re-attach checkout button event
        const newCheckoutBtn = cartSummary.querySelector('.checkout-btn');
        if (newCheckoutBtn) {
            newCheckoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    if (window.showNotification) {
                        window.showNotification('Your cart is empty!', 'error');
                    }
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }
    }

    // Update cart in localStorage and re-render
    function updateCart() {
        localStorage.setItem('vitabotCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    // Render order summary on checkout page
    function renderOrderSummary() {
        const orderSummary = document.querySelector('.order-summary-items');
        if (!orderSummary) return;

        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 49.99;
        const total = subtotal + shipping;

        orderSummary.innerHTML = '';
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-summary-item';
            orderItem.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>R ${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderSummary.appendChild(orderItem);
        });

        document.querySelector('.order-subtotal').textContent = `R ${subtotal.toFixed(2)}`;
        document.querySelector('.order-shipping').textContent = shipping === 0 ? 'FREE' : `R ${shipping.toFixed(2)}`;
        document.querySelector('.order-total').textContent = `R ${total.toFixed(2)}`;
    }

    // Setup checkout form
    function setupCheckoutForm() {
        const checkoutForm = document.querySelector('.checkout-form');
        const placeOrderBtn = document.querySelector('.place-order-btn');

        if (!checkoutForm || !placeOrderBtn) return;

        // Payment method selection
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Place order button
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Basic form validation
            const requiredFields = checkoutForm.querySelectorAll('[required]');
            let valid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            // Check if payment method is selected
            const selectedPayment = document.querySelector('.payment-method.selected');
            if (!selectedPayment) {
                valid = false;
                if (window.showNotification) {
                    window.showNotification('Please select a payment method', 'error');
                }
            }

            if (!valid) {
                if (window.showNotification) {
                    window.showNotification('Please fill in all required fields', 'error');
                }
                return;
            }

            // Simulate order processing
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';

            setTimeout(() => {
                // Clear cart
                cart = [];
                localStorage.setItem('vitabotCart', JSON.stringify(cart));
                updateCartCount();

                // Show success message
                if (window.showNotification) {
                    window.showNotification('Order placed successfully! Thank you for your purchase.', 'success');
                }

                // Redirect to thank you page (in a real application)
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }, 3000);
        });
    }

    console.log('VitaBot AI Cart system initialized');
});
