# Icon Offerer Cloud Function

Cloud функция для поиска иконок по естественному запросу с помощью AI API.

## 🚀 Быстрый старт

### API Endpoint
```
POST /function
```

### Заголовки
```
smart-token: <SmartCaptcha токен>
Content-Type: application/json
```

### Запрос
```json
{
  "platform": "antd",
  "request": "поиск",
  "qtty": 5
}
```

### Ответ
```json
{
  "success": true,
  "data": {
    "icon_names": ["SearchOutlined", "SearchFilled", "SearchCircleOutlined"]
  },
  "meta": {
    "platform": "antd",
    "request": "поиск",
    "quantity": 5
  }
}
```

## 📚 Поддерживаемые платформы

- **Ant Design** (`antd`) - иконки Ant Design
- **Material UI** (`mui`) - иконки Material Design  
- **FontAwesome** (`fa`) - популярная библиотека иконок
- **Feather** (`feather`) - минималистичные иконки
- **Ionicons** (`ion`) - иконки для мобильных приложений
- **Bootstrap** (`bootstrap`) - иконки Bootstrap
- **Tabler** (`tabler`) - современные иконки
- **Remix** (`remix`) - универсальные иконки
- **Heroicons** (`hero`) - иконки от Tailwind CSS
- **Lucide** (`lucide`) - красивые иконки
- **Unicode** (`unicode`) - эмодзи и символы

## ⚙️ Параметры

- `platform` (обязательный) - платформа иконок
- `request` (обязательный) - описание иконки (до 50 символов)
- `qtty` (опциональный) - количество иконок (1-10, по умолчанию 5)

## 🛡️ Безопасность

Функция защищена с помощью **Yandex SmartCaptcha**. Каждый запрос должен содержать валидный токен в заголовке `smart-token`.

### Получение токена SmartCaptcha

1. Интегрируйте SmartCaptcha на вашем сайте
2. Получите токен после прохождения проверки
3. Передайте токен в заголовке `smart-token`

### Ошибки безопасности

- **403 Forbidden** - неверный или отсутствующий токен SmartCaptcha
- **500 Internal Server Error** - ошибка конфигурации SmartCaptcha

## 🔧 Установка

### Переменные окружения
```bash
AI_API_URL=https://api.deepseek.com/chat/completions
AI_API_TOKEN=your_api_token_here
CAPTCHA_SECRET=your_smartcaptcha_secret_here
```

### Тестовый режим
Для тестирования можно отключить проверку SmartCaptcha:
```bash
NODE_ENV=test
# или
CAPTCHA_TEST_MODE=true
```

В тестовом режиме:
- `CAPTCHA_SECRET` не обязателен
- Любой непустой токен в заголовке `smart-token` принимается
- Реальная валидация через Yandex API не выполняется

### Деплой
```bash
# Установка зависимостей
npm install

# Публикация функции
npx ycnf public

# Проверка статуса
npx ycnf check
```

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Тесты с покрытием
npm run test:coverage

# Интеграционные тесты
npm run test:integration
```

## 📝 Примеры использования

```bash
# Поиск иконок поиска
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "antd", "request": "поиск"}'

# Поиск иконок пользователя в FontAwesome
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "fa", "request": "пользователь", "qtty": 3}'

# Поиск Unicode эмодзи
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "unicode", "request": "сердце"}'
```

## 🔄 CI/CD

Автоматический деплой через GitHub Actions:
- Тесты запускаются при любых изменениях
- Деплой только при изменениях в `src/` или `.functionconfig.json`

## 📖 Документация

- [YCNF CLI](https://www.npmjs.com/package/ycnf)
- [Yandex Cloud Functions](https://cloud.yandex.ru/docs/functions/)