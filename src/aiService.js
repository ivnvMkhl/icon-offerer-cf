/**
 * Сервис для работы с AI API
 */

const { createPrompt } = require('./prompt');
const { validateAIResponse } = require('./validation');

/**
 * Отправляет запрос к AI API
 * @param {string} platform - Платформа иконок
 * @param {string} request - Запрос пользователя
 * @param {number} quantity - Количество иконок для возврата
 * @returns {Promise<Object>} Результат запроса к AI
 */
async function callAIAPI(platform, request, quantity = 3) {
  const token = process.env.TOKEN;
  const baseUrl = process.env.BASE_URL;

  const prompt = createPrompt(platform, request, quantity);

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(prompt),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `AI API returned error: ${response.status} ${response.statusText}. Response: ${errorText}`
    );
  }

  const json = await response.json();

  if (!json.choices || !Array.isArray(json.choices) || json.choices.length === 0) {
    throw new Error("Invalid AI response: missing choices array");
  }

  const message = json.choices[0].message;
  if (!message || !message.content) {
    throw new Error("Invalid AI response: missing content in message");
  }

  let responseData;
  try {
    responseData = JSON.parse(message.content);
  } catch (parseError) {
    throw new Error(
      `AI returned invalid JSON: ${parseError.message}. Content: ${message.content}`
    );
  }

  const validation = validateAIResponse(responseData, quantity);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  return responseData;
}

module.exports = {
  callAIAPI,
};
