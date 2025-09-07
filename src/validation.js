/**
 * Константы и валидация для Icon Offerer Cloud Function
 */

// Поддерживаемые платформы иконок
const SUPPORTED_PLATFORMS = new Set([
  "antd",
  "mui", 
  "fa",
  "feather",
  "ion",
  "bootstrap",
  "tabler",
  "remix",
  "hero",
  "lucide",
  "unicode",
]);

// Максимальная длина запроса
const MAX_REQUEST_LENGTH = 50;

// Минимальная длина запроса
const MIN_REQUEST_LENGTH = 1;

// Количество иконок в ответе
const EXPECTED_ICON_COUNT = 3;

/**
 * Валидирует платформу иконок
 * @param {string} platform - Платформа для валидации
 * @returns {Object} Результат валидации
 */
function validatePlatform(platform) {
  if (!platform) {
    return {
      isValid: false,
      error: "Missing Required Field",
      message: "Missing required field: platform",
      details: "Specify icon platform (antd, mui, fa, feather, ion, bootstrap, tabler, remix, hero, lucide, unicode)",
    };
  }

  if (!SUPPORTED_PLATFORMS.has(platform)) {
    return {
      isValid: false,
      error: "Invalid Platform",
      message: "Invalid icon platform specified",
      details: `Supported platforms: ${Array.from(SUPPORTED_PLATFORMS).join(", ")}. Received: ${platform}`,
      supported_platforms: Array.from(SUPPORTED_PLATFORMS),
    };
  }

  return { isValid: true };
}

/**
 * Валидирует запрос пользователя
 * @param {string} request - Запрос для валидации
 * @returns {Object} Результат валидации
 */
function validateRequest(request) {
  if (!request) {
    return {
      isValid: false,
      error: "Missing Required Field",
      message: "Missing required field: request",
      details: "Specify icon description for search",
    };
  }

  if (typeof request !== "string") {
    return {
      isValid: false,
      error: "Invalid Request",
      message: "Request must be a string",
      details: "Request field must contain icon description text",
    };
  }

  const trimmedRequest = request.trim();

  if (trimmedRequest.length === 0) {
    return {
      isValid: false,
      error: "Invalid Request",
      message: "Request cannot be empty",
      details: "Request field must contain icon description text",
    };
  }

  if (trimmedRequest.length > MAX_REQUEST_LENGTH) {
    return {
      isValid: false,
      error: "Request Too Long",
      message: "Request description exceeds maximum length",
      details: `Maximum request length is ${MAX_REQUEST_LENGTH} characters. Current length: ${trimmedRequest.length}`,
      current_length: trimmedRequest.length,
      max_allowed: MAX_REQUEST_LENGTH,
    };
  }

  return { isValid: true, trimmedRequest };
}

/**
 * Валидирует тело запроса
 * @param {Object} body - Тело запроса
 * @returns {Object} Результат валидации
 */
function validateRequestBody(body) {
  if (!body) {
    return {
      isValid: false,
      error: "Bad Request",
      message: "Missing request body",
      details: "Request must contain JSON body with platform and request fields",
    };
  }

  const platformValidation = validatePlatform(body.platform);
  if (!platformValidation.isValid) {
    return platformValidation;
  }

  const requestValidation = validateRequest(body.request);
  if (!requestValidation.isValid) {
    return requestValidation;
  }

  return {
    isValid: true,
    platform: body.platform,
    request: requestValidation.trimmedRequest,
  };
}

/**
 * Валидирует ответ AI
 * @param {Object} responseData - Данные ответа от AI
 * @returns {Object} Результат валидации
 */
function validateAIResponse(responseData) {
  if (!responseData.icon_names) {
    return {
      isValid: false,
      error: "AI response missing icon_names field",
    };
  }

  if (!Array.isArray(responseData.icon_names)) {
    return {
      isValid: false,
      error: "icon_names field must be an array",
    };
  }

  if (responseData.icon_names.length !== EXPECTED_ICON_COUNT) {
    return {
      isValid: false,
      error: `Expected ${EXPECTED_ICON_COUNT} icons, received: ${responseData.icon_names.length}`,
    };
  }

  const invalidIcons = responseData.icon_names.filter(
    (icon) => typeof icon !== "string"
  );
  
  if (invalidIcons.length > 0) {
    return {
      isValid: false,
      error: `Invalid icon formats: ${invalidIcons.join(", ")}`,
    };
  }

  return { isValid: true };
}

/**
 * Валидирует переменные окружения
 * @returns {Object} Результат валидации
 */
function validateEnvironmentVariables() {
  const token = process.env.TOKEN;
  const baseUrl = process.env.BASE_URL;

  if (!token) {
    return {
      isValid: false,
      error: "Configuration Error",
      message: "Missing authorization token",
      details: "Environment variable TOKEN is not set",
    };
  }

  if (!baseUrl) {
    return {
      isValid: false,
      error: "Configuration Error",
      message: "Missing base URL",
      details: "Environment variable BASE_URL is not set",
    };
  }

  return { isValid: true };
}

module.exports = {
  SUPPORTED_PLATFORMS,
  MAX_REQUEST_LENGTH,
  MIN_REQUEST_LENGTH,
  EXPECTED_ICON_COUNT,
  validatePlatform,
  validateRequest,
  validateRequestBody,
  validateAIResponse,
  validateEnvironmentVariables,
};
