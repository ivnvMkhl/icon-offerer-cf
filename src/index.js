import {
  handlePreflightRequest,
  createMethodNotAllowedResponse,
  createValidationErrorResponse,
  createConfigurationErrorResponse,
  createSuccessResponse,
  createProcessingErrorResponse,
} from './cors.js';

import { validateRequestBody, validateEnvironmentVariables } from './validation.js';
import { callAIAPI } from './aiService.js';

/**
 * Основной обработчик Cloud Function
 * @param {Object} event - Событие от Yandex Cloud
 * @param {Object} context - Контекст выполнения
 * @returns {Promise<Object>} HTTP ответ
 */
module.exports.handler = async function (event, context) {
  // Обработка preflight OPTIONS запросов
  if (event.httpMethod === "OPTIONS") {
    return handlePreflightRequest();
  }

  // Проверка метода запроса
  if (event.httpMethod !== "POST") {
    return createMethodNotAllowedResponse();
  }

  // Валидация переменных окружения
  const envValidation = validateEnvironmentVariables();
  if (!envValidation.isValid) {
    return createConfigurationErrorResponse(
      envValidation.error,
      envValidation.message,
      envValidation.details
    );
  }

  // Парсинг тела запроса
  if (!event.body) {
    return createValidationErrorResponse(
      "Bad Request",
      "Missing request body",
      "Request must contain JSON body with platform and request fields"
    );
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (parseError) {
    return createValidationErrorResponse(
      "Invalid JSON",
      "Invalid JSON in request body",
      "Check JSON syntax. Error: " + parseError.message
    );
  }

  // Валидация тела запроса
  const bodyValidation = validateRequestBody(body);
  if (!bodyValidation.isValid) {
    const additionalData = {};
    if (bodyValidation.supported_platforms) {
      additionalData.supported_platforms = bodyValidation.supported_platforms;
    }
    if (bodyValidation.current_length) {
      additionalData.current_length = bodyValidation.current_length;
      additionalData.max_allowed = bodyValidation.max_allowed;
    }
    
    return createValidationErrorResponse(
      bodyValidation.error,
      bodyValidation.message,
      bodyValidation.details,
      additionalData
    );
  }

  try {
    // Вызов AI API
    const responseData = await callAIAPI(
      bodyValidation.platform, 
      bodyValidation.request, 
      bodyValidation.quantity
    );

    // Возврат успешного ответа
    return createSuccessResponse(responseData, {
      platform: bodyValidation.platform,
      request: bodyValidation.request,
      quantity: bodyValidation.quantity,
      model: "deepseek-coder",
    });
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      requestBody: body,
      timestamp: new Date().toISOString(),
    });

    const isApiError = error.message.includes("AI API returned error");
    return createProcessingErrorResponse(
      "Error processing request",
      error.message,
      context.awsRequestId,
      isApiError
    );
  }
};

export { handler };
