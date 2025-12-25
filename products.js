// Данные товаров (Telegram аккаунтов)

const PRODUCTS = [
    {
        id: 1,
        title: "Premium Telegram Аккаунт",
        description: "Аккаунт премиум-класса с историей с 2018 года. Идеален для бизнеса.",
        price: 499,
        category: "premium",
        rating: 4.9,
        features: ["Верификация", "История с 2018", "Без спама", "Гарантия 1 год"],
        date: "2024-01-15",
        stock: 5
    },
    {
        id: 2,
        title: "Бизнес Telegram Канал",
        description: "Готовый канал с аудиторией 10K+ подписчиков. Высокая активность.",
        price: 899,
        category: "business",
        rating: 4.7,
        features: ["10K+ подписчиков", "Активная аудитория", "Готовый контент", "Аналитика"],
        date: "2024-01-14",
        stock: 3
    },
    {
        id: 3,
        title: "Личный Аккаунт VIP",
        description: "Личный аккаунт с уникальным username. Полная анонимность гарантирована.",
        price: 299,
        category: "personal",
        rating: 4.8,
        features: ["Уникальный username", "Полная анонимность", "Без привязки", "Гарантия"],
        date: "2024-01-13",
        stock: 10
    },
    {
        id: 4,
        title: "Крипто Telegram Группа",
        description: "Группа для крипто-трейдинга с настроенными ботами и каналами.",
        price: 649,
        category: "business",
        rating: 4.6,
        features: ["Настроенные боты", "Каналы", "Крипто-сообщество", "Аналитика"],
        date: "2024-01-12",
        stock: 2
    },
    {
        id: 5,
        title: "Анонимный Аккаунт",
        description: "Полностью анонимный аккаунт без привязки к номеру. Максимальная безопасность.",
        price: 199,
        category: "personal",
        rating: 4.5,
        features: ["Полная анонимность", "Без номера", "VPN включен", "Гарантия"],
        date: "2024-01-11",
        stock: 15
    },
    {
        id: 6,
        title: "Медиа Telegram Канал",
        description: "Канал с аудиторией 50K+ для медиа и развлечений. Высокие просмотры.",
        price: 1499,
        category: "channel",
        rating: 4.9,
        features: ["50K+ подписчиков", "Высокие просмотры", "Медиа-контент", "Монетизация"],
        date: "2024-01-10",
        stock: 1
    },
    {
        id: 7,
        title: "Стартовый Набор",
        description: "Набор из 5 базовых аккаунтов для разных целей. Отличное начало.",
        price: 399,
        category: "premium",
        rating: 4.4,
        features: ["5 аккаунтов", "Разные цели", "Гарантия", "Поддержка"],
        date: "2024-01-09",
        stock: 8
    },
    {
        id: 8,
        title: "Корпоративный Пакет",
        description: "Комплексное решение для бизнеса: аккаунты + каналы + группы.",
        price: 2499,
        category: "business",
        rating: 5.0,
        features: ["Полный пакет", "Корпоративный", "Поддержка 24/7", "Обучение"],
        date: "2024-01-08",
        stock: 2
    },
    {
        id: 9,
        title: "Геймерский Telegram",
        description: "Аккаунт для игровых сообществ и киберспорта. Уже есть аудитория.",
        price: 549,
        category: "channel",
        rating: 4.7,
        features: ["Геймерская аудитория", "Киберспорт", "Стримы", "Сообщество"],
        date: "2024-01-07",
        stock: 4
    },
    {
        id: 10,
        title: "Элитный Username",
        description: "Аккаунт с коротким и запоминающимся username. Эксклюзивное предложение.",
        price: 999,
        category: "premium",
        rating: 4.8,
        features: ["Эксклюзивный username", "Короткий", "Запоминающийся", "Гарантия"],
        date: "2024-01-06",
        stock: 1
    }
];

// Поиск товара по ID
function getProductById(id) {
    return PRODUCTS.find(product => product.id === id);
}

// Фильтрация товаров по категории
function getProductsByCategory(category) {
    return PRODUCTS.filter(product => product.category === category);
}

// Получение популярных товаров
function getPopularProducts(limit = 4) {
    return [...PRODUCTS]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

// Получение новинок
function getNewProducts(limit = 4) {
    return [...PRODUCTS]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}
