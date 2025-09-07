/**
 * AI промпт для поиска иконок
 */

/**
 * Создает системный промпт для AI
 * @returns {string} Системный промпт
 */
function getSystemPrompt() {
  return `Ты — эксперт по дизайн-системам и иконографике. Твоя задача — по описанию от пользователя (request) подобрать три точных названия иконок из указанной библиотеки (platform).

КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО в формате валидного JSON без каких-либо пояснений.
2. Структура ответа ДОЛЖНА быть строго такой: { "icon_names": ["string", "string", "string"] }
3. Всегда возвращай ровно три варианта иконок.
4. Первая иконка в списке — наиболее подходящая по запросу, остальные — альтернативные варианты.
5. Используй только официальные названия иконок из запрашиваемой платформы.
6. Для платформы unicode возвращай коды в формате ["U+XXXX", "U+XXXX", "U+XXXX"].

Доступные библиотеки иконок:
- Ant Design Icons (antd)
- Material Design Icons (mui) 
- FontAwesome (fa)
- Feather Icons (feather)
- Ionicons (ion)
- Bootstrap Icons (bootstrap)
- Tabler Icons (tabler)
- Remix Icon (remix)
- Heroicons (hero)
- Lucide (lucide)
- Unicode (unicode)

Формат именования для каждой библиотеки:
- Ant Design: Name + Outlined/Filled (Example: HistoryOutlined)
- Material UI: Name + Outlined/Filled/Rounded/Sharp (Example: HistoryOutlined)
- FontAwesome: fa-* (Example: fa-history)
- Feather: lowercase-with-dashes (Example: history)
- Ionicons: ion-* (Example: ion-md-history)
- Unicode: U+XXXX (Example: U+1F4AC)`;
}

/**
 * Создает пользовательский промпт
 * @param {string} platform - Платформа иконок
 * @param {string} request - Запрос пользователя
 * @returns {string} JSON строка с данными запроса
 */
function getUserPrompt(platform, request) {
  return JSON.stringify({
    platform,
    request,
  });
}

/**
 * Создает полный промпт для AI API
 * @param {string} platform - Платформа иконок
 * @param {string} request - Запрос пользователя
 * @returns {Object} Промпт для отправки в AI API
 */
function createPrompt(platform, request) {
  return {
    model: "deepseek-coder",
    messages: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
      {
        role: "user",
        content: getUserPrompt(platform, request),
      },
    ],
    temperature: 0.1,
    max_tokens: 50,
  };
}

module.exports = {
  getSystemPrompt,
  getUserPrompt,
  createPrompt,
};
