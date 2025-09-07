# Template Yandex Cloud Function

Шаблон для создания репозитория Yandex Cloud Functions и автопубликацией с помощью GitHub Actions и утилиты [ycnf](https://www.npmjs.com/package/ycnf).

## Документация

- [YCNF CLI Documentation](https://www.npmjs.com/package/ycnf) - Документация утилиты ycnf
- [Yandex Cloud Functions](https://cloud.yandex.ru/docs/functions/) - Официальная документация

## Команды

```bash
# Публикация функции
npx ycnf public

# Проверка статуса функции
npx ycnf check

# Удаление функции
npx ycnf delete
```

## Требования для локальной работы

- Node.js >= 14.0.0
- Yandex Cloud CLI
- Настроенный аккаунт Yandex Cloud
- ID папки в Yandex Cloud в .env (YC_FOLDER_ID)

## Настройка автоматического деплоя

Добавить в Github репозиторий секреты

```
secrets.YC_TOKEN
secrets.YC_CLOUD_ID
secrets.YC_FOLDER_ID
```
