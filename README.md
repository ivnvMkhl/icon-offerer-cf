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
  "request": "поиск"
}
```

**Параметры:**
- `platform` (обязательный) - платформа иконок из списка поддерживаемых
- `request` (обязательный) - описание иконки на естественном языке (максимум 50 символов)

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
    "model": "deepseek-coder"
  }
}
```

### Примеры запросов

```bash
# Поиск иконки поиска в Ant Design
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "antd", "request": "поиск"}'

# Поиск иконки пользователя в FontAwesome
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "fa", "request": "пользователь"}'

# Поиск иконки настроек в Material UI
curl -X POST https://your-function-url \
  -H "Content-Type: application/json" \
  -d '{"platform": "mui", "request": "настройки"}'
```

## Установка и развертывание

### Требования

- Node.js >= 14.0.0
- Yandex Cloud CLI
- Настроенный аккаунт Yandex Cloud
- ID папки в Yandex Cloud

### Переменные окружения

Установите следующие переменные окружения в Yandex Cloud Function:


- `BASE_URL` - URL эндпоинта AI API

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

- **Валидация входных данных** - проверка корректности платформы и запроса
- **Обработка ошибок** - детальные сообщения об ошибках
- **Ограничения** - максимальная длина запроса 50 символов
- **AI интеграция** - использует модель deepseek-coder для понимания естественного языка

## Документация

- [YCNF CLI Documentation](https://www.npmjs.com/package/ycnf) - Документация утилиты ycnf
- [Yandex Cloud Functions](https://cloud.yandex.ru/docs/functions/) - Официальная документация
