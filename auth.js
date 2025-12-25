// Система авторизации и регистрации

// Проверка авторизации при загрузке
function checkAuth() {
    const currentUser = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        // Пользователь авторизован
        if (loginBtn) loginBtn.classList.add('hidden');
        if (registerBtn) registerBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        // Пользователь не авторизован
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (registerBtn) registerBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
}

// Получение текущего пользователя
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Получение всех пользователей
function getAllUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

// Сохранение пользователей
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Регистрация нового пользователя
function registerUser(username, email, password) {
    // Проверка существующих пользователей
    const users = getAllUsers();
    
    // Проверка уникальности email
    if (users.some(user => user.email === email)) {
        showAuthMessage('Пользователь с таким email уже существует', 'error');
        return false;
    }
    
    // Проверка уникальности username
    if (users.some(user => user.username === username)) {
        showAuthMessage('Пользователь с таким именем уже существует', 'error');
        return false;
    }
    
    // Создание нового пользователя
    const newUser = {
        id: Date.now(),
        username,
        email,
        password: btoa(password), // Простое шифрование (для демо)
        registered: new Date().toISOString(),
        level: 1,
        purchases: []
    };
    
    // Сохранение пользователя
    users.push(newUser);
    saveUsers(users);
    
    // Автоматический вход
    loginUser(email, password);
    
    return true;
}

// Вход пользователя
function loginUser(email, password) {
    const users = getAllUsers();
    const encryptedPassword = btoa(password);
    
    // Поиск пользователя
    const user = users.find(u => u.email === email && u.password === encryptedPassword);
    
    if (user) {
        // Сохранение текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Обновление интерфейса
        checkAuth();
        
        // Закрытие модального окна
        document.getElementById('authModal')?.classList.remove('active');
        
        // Показ уведомления
        showNotification(`Добро пожаловать, ${user.username}!`, 'success');
        
        // Обновление профиля и покупок
        loadProfile();
        loadUserPurchases();
        
        return true;
    } else {
        showAuthMessage('Неверный email или пароль', 'error');
        return false;
    }
}

// Выход пользователя
function logout() {
    // Удаление текущего пользователя
    localStorage.removeItem('currentUser');
    
    // Обновление интерфейса
    checkAuth();
    
    // Переход на главную страницу
    switchPage('home');
    
    // Показ уведомления
    showNotification('Вы вышли из аккаунта', 'info');
    
    // Обновление профиля
    loadProfile();
}

// Обновление пользователя
function updateUser(updatedUser) {
    const users = getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
        
        // Обновление текущего пользователя
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        return true;
    }
    
    return false;
}

// Показ сообщения в форме авторизации
function showAuthMessage(message, type = 'error') {
    const messageEl = document.getElementById('authMessage');
    if (!messageEl) return;
    
    messageEl.textContent = message;
    messageEl.className = 'auth-message';
    messageEl.classList.add(type);
    
    // Автоматическое скрытие
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'auth-message';
    }, 5000);
}

// Обработка формы входа
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showAuthMessage('Заполните все поля', 'error');
        return;
    }
    
    loginUser(email, password);
});

// Обработка формы регистрации
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Валидация
    if (!username || !email || !password || !confirmPassword) {
        showAuthMessage('Заполните все поля', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    
    if (!email.includes('@')) {
        showAuthMessage('Введите корректный email', 'error');
        return;
    }
    
    // Регистрация пользователя
    registerUser(username, email, password);
});

// Получение покупок пользователя
function getUserPurchases() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    const purchasesJson = localStorage.getItem(`purchases_${currentUser.id}`);
    return purchasesJson ? JSON.parse(purchasesJson) : [];
}

// Сохранение покупок пользователя
function saveUserPurchases(purchases) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    localStorage.setItem(`purchases_${currentUser.id}`, JSON.stringify(purchases));
}

// Добавление покупки
function addUserPurchase(purchase) {
    const purchases = getUserPurchases();
    purchases.push({
        ...purchase,
        purchaseDate: new Date().toISOString(),
        id: Date.now()
    });
    
    saveUserPurchases(purchases);
    
    // Обновление пользователя
    const currentUser = getCurrentUser();
    if (currentUser) {
        currentUser.purchases = purchases;
        updateUser(currentUser);
    }
    
    return true;
}
