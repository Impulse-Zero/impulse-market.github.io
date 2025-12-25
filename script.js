// Основной скрипт для управления сайтом

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    loadCart();
    checkAuth();
    updateCartCount();
});

// Инициализация приложения
function initApp() {
    // Навигация
    setupNavigation();
    
    // Модальное окно
    setupModal();
    
    // Страницы
    setupPages();
    
    // Анимации при скролле
    setupScrollAnimations();
    
    // Загрузка товаров
    loadProducts();
    
    // Загрузка покупок
    loadUserPurchases();
    
    // Загрузка профиля
    loadProfile();
}

// Настройка навигации
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Переключение мобильного меню
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Переключение активной страницы
    document.querySelectorAll('.nav-link, button[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                switchPage(pageId);
            }
        });
    });
    
    // Кнопки входа/регистрации
    document.getElementById('loginBtn')?.addEventListener('click', () => openAuthModal('login'));
    document.getElementById('registerBtn')?.addEventListener('click', () => openAuthModal('register'));
    document.getElementById('profileLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
    document.getElementById('profileRegisterBtn')?.addEventListener('click', () => openAuthModal('register'));
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

// Переключение страниц
function switchPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показать выбранную страницу
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Обновить активную ссылку в навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Прокрутить вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Загрузить контент страницы
    switch(pageId) {
        case 'market':
            loadProducts();
            break;
        case 'purchases':
            loadUserPurchases();
            break;
        case 'profile':
            loadProfile();
            break;
        case 'cart':
            loadCart();
            break;
    }
}

// Настройка модального окна
function setupModal() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            modal.classList.remove('active');
        }
    });
    
    // Переключение вкладок
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAuthTab(tabId);
        });
    });
}

// Открытие модального окна авторизации
function openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    switchAuthTab(tab);
}

// Переключение вкладок авторизации
function switchAuthTab(tab) {
    // Обновить активную вкладку
    document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.remove('active');
        if (t.getAttribute('data-tab') === tab) {
            t.classList.add('active');
        }
    });
    
    // Обновить активную форму
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.getElementById(tab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
    
    // Обновить заголовок
    document.getElementById('modalTitle').textContent = 
        tab === 'login' ? 'Вход в аккаунт' : 'Регистрация';
}

// Настройка страниц
function setupPages() {
    // Поиск товаров
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Фильтры
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    // Кнопка "Подробнее"
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const trustSection = document.querySelector('.trust-section');
            trustSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Анимации при скролле
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Загрузка товаров
function loadProducts(filter = {}) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Фильтрация и сортировка товаров
    let filteredProducts = [...PRODUCTS];
    
    // Поиск по названию
    const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery)
        );
    }
    
    // Фильтрация по категории
    const category = document.getElementById('categoryFilter')?.value;
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }
    
    // Сортировка
    const sort = document.getElementById('sortFilter')?.value;
    switch(sort) {
        case 'cheap':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'expensive':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // Отображение товаров
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Фильтрация товаров
function filterProducts() {
    loadProducts();
}

// Создание карточки товара
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <div class="product-badge">${product.category}</div>
        <div class="product-image">
            <i class="fab fa-telegram"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>${product.rating}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-buy" onclick="buyProduct(${product.id})">
                    <i class="fas fa-bolt"></i> Купить
                </button>
                <button class="btn-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> В корзину
                </button>
            </div>
        </div>
    `;
    return div;
}

// Загрузка профиля
function loadProfile() {
    const container = document.getElementById('profileContainer');
    if (!container) return;
    
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        document.getElementById('profileNotLogged')?.classList.remove('hidden');
        return;
    }
    
    document.getElementById('profileNotLogged')?.classList.add('hidden');
    
    // Статистика пользователя
    const purchases = getUserPurchases();
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    
    container.innerHTML = `
        <div class="profile-info">
            <div class="profile-header-info">
                <div class="profile-avatar">
                    ${currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div class="profile-details">
                    <h3>${currentUser.username}</h3>
                    <p><i class="fas fa-envelope"></i> ${currentUser.email}</p>
                    <p><i class="fas fa-calendar-alt"></i> Зарегистрирован: ${new Date(currentUser.registered).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-box">
                    <h4>${purchases.length}</h4>
                    <p>Всего покупок</p>
                </div>
                <div class="stat-box">
                    <h4>$${totalSpent}</h4>
                    <p>Всего потрачено</p>
                </div>
                <div class="stat-box">
                    <h4>${currentUser.level || 1}</h4>
                    <p>Уровень</p>
                </div>
                <div class="stat-box">
                    <h4>${getDaysRegistered(currentUser.registered)}</h4>
                    <p>Дней с нами</p>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn-primary" onclick="showEditProfile()">
                    <i class="fas fa-edit"></i> Редактировать профиль
                </button>
                <button class="btn-secondary" onclick="showPurchaseHistory()">
                    <i class="fas fa-history"></i> История покупок
                </button>
                <button class="btn-logout" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Выйти
                </button>
            </div>
        </div>
    `;
}

// Получение количества дней с регистрации
function getDaysRegistered(registrationDate) {
    const regDate = new Date(registrationDate);
    const today = new Date();
    const diffTime = Math.abs(today - regDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Показ истории покупок
function showPurchaseHistory() {
    switchPage('purchases');
}

// Показ формы редактирования профиля
function showEditProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    showNotification('Функция редактирования профиля в разработке', 'info');
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Автоматическое удаление уведомления
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
