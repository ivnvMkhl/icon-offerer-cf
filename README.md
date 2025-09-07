# Icon Offerer Cloud Function

Cloud функция для Yandex Cloud, которая предоставляет API для поиска иконок по естественному (словесному) запросу с использованием AI API.

## Описание

Эта функция принимает текстовое описание иконки и возвращает три подходящих варианта из указанной библиотеки иконок. Поддерживаются популярные библиотеки иконок, включая Ant Design, Material UI, FontAwesome, Feather Icons и другие.

## Поддерживаемые платформы иконок

- **Ant Design Icons** (`antd`) - иконки в стиле Ant Design
- **Material Design Icons** (`mui`) - иконки Material Design
- **FontAwesome** (`fa`) - популярная библиотека иконок
- **Feather Icons** (`feather`) - минималистичные иконки
- **Ionicons** (`ion`) - иконки для мобильных приложений
- **Bootstrap Icons** (`bootstrap`) - иконки Bootstrap
- **Tabler Icons** (`tabler`) - современные иконки
- **Remix Icon** (`remix`) - универсальные иконки
- **Heroicons** (`hero`) - иконки от создателей Tailwind CSS
- **Lucide** (`lucide`) - красивые иконки
- **Unicode** (`unicode`) - эмодзи и символы Unicode

## API

### Endpoint
```
POST /function
```

### Запрос
```json
{
  "platform": "antd",
  "request": "поиск",
  "qtty": 5
}
```

**Параметры:**
- `platform` (обязательный) - платформа иконок из списка поддерживаемых
- `request` (обязательный) - описание иконки на естественном языке (максимум 50 символов)
- `qtty` (опциональный) - количество иконок для возврата (1-10, по умолчанию 5)

### Ответ
```json
{
  "success": true,
  "data": {
    "icon_names": ["SearchOutlined", "SearchFilled", "SearchCircleOutlined", "SearchIcon", "MagnifyingGlassIcon"]
  },
  "meta": {
    "platform": "antd",
    "request": "поиск",
    "quantity": 5,
    "model": "deepseek-coder"
  }
}
```

### Примеры запросов

```bash
# Поиск 3 иконок поиска в Ant Design (по умолчанию)
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "antd", "request": "поиск"}'

# Поиск 5 иконок пользователя в FontAwesome
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "fa", "request": "пользователь", "qtty": 5}'

# Поиск 1 иконки настроек в Material UI
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "mui", "request": "настройки", "qtty": 1}'

# Поиск 10 иконок стрелок в Lucide
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "lucide", "request": "стрелка", "qtty": 10}'
```

## Установка и развертывание

### Требования

- Node.js >= 14.0.0
- Yandex Cloud CLI
- Настроенный аккаунт Yandex Cloud
- ID папки в Yandex Cloud

### Переменные окружения

Установите следующие переменные окружения в Yandex Cloud Function для работы функции и .env файл для локального запуска тестов:

- `AI_API_URL` - URL эндпоинта AI API
- `AI_API_TOKEN` - Токен для AI API

### Команды для развертывания

```bash
# Публикация функции
npx ycnf public

# Проверка статуса функции
npx ycnf check

# Удаление функции
npx ycnf delete
```

## Настройка автоматического деплоя

Добавьте в GitHub репозиторий следующие секреты:

```
secrets.YC_TOKEN
secrets.YC_CLOUD_ID
secrets.YC_FOLDER_ID
```

## Особенности

- **CORS поддержка** - функция поддерживает CORS для использования в веб-приложениях
- **Валидация входных данных** - проверка корректности платформы, запроса и количества
- **Обработка ошибок** - детальные сообщения об ошибках
- **Ограничения** - максимальная длина запроса 50 символов, количество иконок 1-10
- **AI интеграция** - использует модель deepseek-coder для понимания естественного языка
- **Гибкое количество** - возможность запросить от 1 до 10 иконок (по умолчанию 3)
- **Умный AI** - AI сам решает количество иконок, если не указан параметр qtty

## Документация

- [YCNF CLI Documentation](https://www.npmjs.com/package/ycnf) - Документация утилиты ycnf
- [Yandex Cloud Functions](https://cloud.yandex.ru/docs/functions/) - Официальная документация
