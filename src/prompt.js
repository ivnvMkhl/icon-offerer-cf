/**
 * AI промпт для поиска иконок
 */

/**
 * Создает системный промпт для AI
 * @param {number} quantity - Количество иконок для возврата
 * @returns {string} Системный промпт
 */
function getSystemPrompt(quantity = 5) {
  return `Ты — эксперт по дизайн-системам и иконографике. Твоя задача — по описанию от пользователя (request) подобрать точные названия иконок из указанной библиотеки (platform).

КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО в формате валидного JSON без каких-либо пояснений.
2. Структура ответа ДОЛЖНА быть строго такой: { "icon_names": ["string", "string", ...] }
3. Возвращай ровно ${quantity} вариантов иконок.
4. Первая иконка в списке — наиболее подходящая по запросу, остальные — альтернативные варианты в порядке убывания релевантности.
5. Используй только официальные названия иконок из запрашиваемой платформы.
6. Для платформы unicode возвращай коды в формате ["U+XXXX", "U+XXXX", ...].
7. Если не можешь найти ${quantity} подходящих иконок, верни столько, сколько найдешь (но не менее 1).

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
 * @param {number} quantity - Количество иконок для возврата
 * @returns {Object} Промпт для отправки в AI API
 */
function createPrompt(platform, request, quantity = 3) {
  return {
    model: "deepseek-coder",
    messages: [
      {
        role: "system",
        content: getSystemPrompt(quantity),
      },
      {
        role: "user",
        content: getUserPrompt(platform, request),
      },
    ],
    temperature: 0.1,
    max_tokens: Math.max(50, quantity * 20), 
  };
}

module.exports = {
  getSystemPrompt,
  getUserPrompt,
  createPrompt,
};
