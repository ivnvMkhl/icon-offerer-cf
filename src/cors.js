/**
 * CORS обработка для Cloud Function
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
};

/**
 * Создает успешный CORS ответ
 * @param {number} statusCode - HTTP статус код
 * @param {Object} body - Тело ответа
 * @param {Object} additionalHeaders - Дополнительные заголовки
 * @returns {Object} Ответ с CORS заголовками
 */
function createCorsResponse(statusCode, body, additionalHeaders = {}) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      ...additionalHeaders,
    },
    body: JSON.stringify(body),
  };
}

/**
 * Обрабатывает preflight OPTIONS запросы
 * @returns {Object} CORS preflight ответ
 */
function handlePreflightRequest() {
  return createCorsResponse(200, {
    message: "CORS preflight successful",
  });
}

/**
 * Создает ответ об ошибке метода
 * @returns {Object} Ошибка метода
 */
function createMethodNotAllowedResponse() {
  return createCorsResponse(
    405,
    {
      error: "Method Not Allowed",
      message: "Only POST requests are supported for this endpoint",
      details: "Use POST method with JSON request body",
    },
    {
      Allow: "POST",
    }
  );
}

/**
 * Создает ответ об ошибке валидации
 * @param {string} error - Тип ошибки
 * @param {string} message - Сообщение об ошибке
 * @param {string} details - Детали ошибки
 * @param {Object} additionalData - Дополнительные данные
 * @returns {Object} Ошибка валидации
 */
function createValidationErrorResponse(error, message, details, additionalData = {}) {
  return createCorsResponse(400, {
    error,
    message,
    details,
    ...additionalData,
  });
}

/**
 * Создает ответ об ошибке конфигурации
 * @param {string} error - Тип ошибки
 * @param {string} message - Сообщение об ошибке
 * @param {string} details - Детали ошибки
 * @returns {Object} Ошибка конфигурации
 */
function createConfigurationErrorResponse(error, message, details) {
  return createCorsResponse(500, {
    error,
    message,
    details,
  });
}

/**
 * Создает успешный ответ с данными
 * @param {Object} data - Данные ответа
 * @param {Object} meta - Метаданные
 * @returns {Object} Успешный ответ
 */
function createSuccessResponse(data, meta) {
  return createCorsResponse(200, {
    success: true,
    data,
    meta,
  });
}

/**
 * Создает ответ об ошибке обработки
 * @param {string} message - Сообщение об ошибке
 * @param {string} details - Детали ошибки
 * @param {string} requestId - ID запроса
 * @param {boolean} isApiError - Является ли ошибка API ошибкой
 * @returns {Object} Ошибка обработки
 */
function createProcessingErrorResponse(message, details, requestId, isApiError = false) {
  return createCorsResponse(
    isApiError ? 502 : 400,
    {
      error: "Processing Error",
      message,
      details,
      request_id: requestId,
      timestamp: new Date().toISOString(),
    }
  );
}

module.exports = {
  CORS_HEADERS,
  createCorsResponse,
  handlePreflightRequest,
  createMethodNotAllowedResponse,
  createValidationErrorResponse,
  createConfigurationErrorResponse,
  createSuccessResponse,
  createProcessingErrorResponse,
};
