// Система корзины покупок

let cart = [];

// Загрузка корзины из localStorage
function loadCart() {
    const cartJson = localStorage.getItem('cart');
    cart = cartJson ? JSON.parse(cartJson) : [];
    updateCartCount();
    
    // Обновление отображения корзины
    if (document.getElementById('cart').classList.contains('active')) {
        renderCart();
    }
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Обновление счетчика корзины
function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    countElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Добавление товара в корзину
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Войдите в аккаунт, чтобы добавлять товары в корзину', 'warning');
        openAuthModal('login');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: 'fab fa-telegram'
        });
    }
    
    saveCart();
    showNotification(`"${product.title}" добавлен в корзину`, 'success');
    
    // Обновление отображения корзины
    if (document.getElementById('cart').classList.contains('active')) {
        renderCart();
    }
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    
    const product = getProductById(productId);
    if (product) {
        showNotification(`"${product.title}" удален из корзины`, 'info');
    }
    
    renderCart();
}

// Изменение количества товара
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Очистка корзины
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    showNotification('Корзина очищена', 'info');
}

// Оформление заказа
function checkout() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Войдите в аккаунт для оформления заказа', 'warning');
        openAuthModal('login');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'warning');
        return;
    }
    
    // Создание заказа
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: getCartTotal(),
        status: 'completed'
    };
    
    // Добавление покупки в историю
    addUserPurchase(order);
    
    // Очистка корзины
    clearCart();
    
    // Показ подтверждения
    showNotification('Заказ успешно оформлен! Спасибо за покупку!', 'success');
    
    // Переход к покупкам
    switchPage('purchases');
}

// Получение общей суммы корзины
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Отображение корзины
function renderCart() {
    const container = document.getElementById('cartContainer');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state" id="emptyCart">
                <i class="fas fa-shopping-cart fa-3x"></i>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из маркета, чтобы продолжить</p>
                <button class="btn-primary" data-page="market">
                    <i class="fas fa-store"></i> Перейти в магазин
                </button>
            </div>
        `;
        
        // Добавление обработчиков событий
        container.querySelector('button')?.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('market');
        });
        
        return;
    }
    
    let html = `
        <div class="cart-items">
    `;
    
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">$${item.price} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="cart-summary">
            <div class="summary-row">
                <span>Товары (${cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>$${getCartTotal().toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Скидка</span>
                <span>$0.00</span>
            </div>
            <div class="summary-row">
                <span>Комиссия</span>
                <span>$0.00</span>
            </div>
            <div class="summary-row">
                <span class="summary-total">Итого</span>
                <span class="summary-total">$${getCartTotal().toFixed(2)}</span>
            </div>
            <button class="btn-checkout" onclick="checkout()">
                <i class="fas fa-lock"></i> Оформить заказ
            </button>
            <button class="btn-secondary" onclick="clearCart()" style="margin-top: 1rem; width: 100%;">
                <i class="fas fa-trash"></i> Очистить корзину
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Покупка товара (прямая покупка без корзины)
function buyProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showNotification('Войдите в аккаунт для совершения покупки', 'warning');
        openAuthModal('login');
        return;
    }
    
    // Создание заказа
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [{
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            image: 'fab fa-telegram'
        }],
        total: product.price,
        status: 'completed'
    };
    
    // Добавление покупки в историю
    addUserPurchase(order);
    
    // Показ подтверждения
    showNotification(`"${product.title}" успешно куплен! Спасибо за покупку!`, 'success');
    
    // Обновление страницы покупок
    loadUserPurchases();
}

// Загрузка покупок пользователя
function loadUserPurchases() {
    const container = document.getElementById('purchasesContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        document.getElementById('emptyPurchases')?.classList.remove('hidden');
        return;
    }
    
    const purchases = getUserPurchases();
    
    if (purchases.length === 0) {
        document.getElementById('emptyPurchases')?.classList.remove('hidden');
        return;
    }
    
    document.getElementById('emptyPurchases')?.classList.add('hidden');
    
    let html = `
        <div class="purchases-list">
    `;
    
    purchases.forEach(purchase => {
        const purchaseDate = new Date(purchase.purchaseDate);
        const formattedDate = purchaseDate.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">Заказ #${purchase.id}</h4>
                    <p>${formattedDate}</p>
                    <div class="cart-item-price">
                        Товаров: ${purchase.items.reduce((sum, item) => sum + item.quantity, 0)} | 
                        Сумма: $${purchase.total.toFixed(2)}
                    </div>
                    <div class="purchase-status">
                        <span class="status-badge status-${purchase.status}">
                            <i class="fas fa-check-circle"></i> ${purchase.status === 'completed' ? 'Завершен' : 'В обработке'}
                        </span>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-secondary" onclick="viewOrderDetails(${purchase.id})">
                        <i class="fas fa-eye"></i> Подробности
                    </button>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

// Просмотр деталей заказа
function viewOrderDetails(orderId) {
    const purchases = getUserPurchases();
    const order = purchases.find(p => p.id === orderId);
    
    if (!order) return;
    
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="cart-item" style="margin-bottom: 1rem;">
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">
                        $${item.price} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        `;
    });
    
    const modalHtml = `
        <div class="modal-overlay active" id="orderDetailsModal">
            <div class="modal">
                <div class="modal-header">
                    <h2><i class="fas fa-receipt"></i> Детали заказа #${order.id}</h2>
                    <button class="close-modal" onclick="closeOrderDetails()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 2rem;">
                        <p><strong>Дата покупки:</strong> ${new Date(order.purchaseDate).toLocaleDateString()}</p>
                        <p><strong>Статус:</strong> <span class="status-badge status-${order.status}">${order.status === 'completed' ? 'Завершен' : 'В обработке'}</span></p>
                        <p><strong>Общая сумма:</strong> $${order.total.toFixed(2)}</p>
                    </div>
                    
                    <h3 style="margin-bottom: 1rem;">Товары:</h3>
                    ${itemsHtml}
                    
                    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--light-gray);">
                        <button class="btn-primary" onclick="closeOrderDetails()" style="width: 100%;">
                            <i class="fas fa-check"></i> Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавление модального окна в DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Добавление обработчика закрытия
    const modal = document.getElementById('orderDetailsModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOrderDetails();
        }
    });
}

// Закрытие деталей заказа
function closeOrderDetails() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.remove();
    }
}
