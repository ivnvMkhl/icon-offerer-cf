/**
 * SmartCaptcha валидация для Yandex Cloud
 */

/**
 * Извлекает IP адрес пользователя из заголовков запроса
 * @param {Object} event - Событие от Yandex Cloud
 * @returns {string|null} IP адрес пользователя
 */
function extractUserIP(event) {
  // Пробуем различные заголовки для получения реального IP
  return event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
         event.headers?.['x-real-ip'] ||
         event.headers?.['x-client-ip'] ||
         event.requestContext?.identity?.sourceIp ||
         null;
}

/**
 * Извлекает токен SmartCaptcha из заголовков
 * @param {Object} event - Событие от Yandex Cloud
 * @returns {string|null} Токен SmartCaptcha
 */
function extractSmartToken(event) {
  return event.headers?.['smart-token'] || 
         event.headers?.['Smart-Token'] ||
         null;
}

/**
 * Валидирует токен SmartCaptcha через Yandex API
 * @param {string} token - Токен для валидации
 * @param {string} ip - IP адрес пользователя (опционально)
 * @returns {Promise<Object>} Результат валидации
 */
async function validateSmartCaptchaToken(token, ip = null) {
  const secret = process.env.CAPTCHA_SECRET;
  const testMode = process.env.NODE_ENV === 'test' || process.env.CAPTCHA_TEST_MODE === 'true';
  
  // В тестовом режиме пропускаем проверку SmartCaptcha
  if (testMode) {
    if (!token) {
      return {
        isValid: false,
        error: "Missing Token",
        message: "SmartCaptcha token is required",
        details: "Header 'smart-token' is missing or empty"
      };
    }
    
    // В тестовом режиме принимаем любой непустой токен
    return {
      isValid: true,
      host: 'test-mode',
      message: 'Token validated in test mode'
    };
  }
  
  if (!secret) {
    return {
      isValid: false,
      error: "Configuration Error",
      message: "SmartCaptcha secret not configured",
      details: "Environment variable CAPTCHA_SECRET is not set"
    };
  }

  if (!token) {
    return {
      isValid: false,
      error: "Missing Token",
      message: "SmartCaptcha token is required",
      details: "Header 'smart-token' is missing or empty"
    };
  }

  try {
    // Подготавливаем данные для отправки
    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('token', token);
    if (ip) {
      formData.append('ip', ip);
    }

    // Отправляем запрос на валидацию
    const response = await fetch('https://smartcaptcha.yandexcloud.net/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      return {
        isValid: false,
        error: "Validation Service Error",
        message: "Failed to connect to SmartCaptcha validation service",
        details: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();

    // Проверяем результат валидации
    if (result.status === 'ok') {
      return {
        isValid: true,
        host: result.host || 'unknown',
        message: result.message || 'Token validated successfully'
      };
    } else {
      return {
        isValid: false,
        error: "Captcha Validation Failed",
        message: result.message || "Token validation failed",
        details: "SmartCaptcha validation returned: " + result.status
      };
    }
  } catch (error) {
    console.error("SmartCaptcha validation error:", error);
    return {
      isValid: false,
      error: "Network Error",
      message: "Failed to validate SmartCaptcha token",
      details: error.message
    };
  }
}

/**
 * Проверяет валидность переменных окружения для SmartCaptcha
 * @returns {Object} Результат валидации
 */
function validateSmartCaptchaEnvironment() {
  const secret = process.env.CAPTCHA_SECRET;
  const testMode = process.env.NODE_ENV === 'test' || process.env.CAPTCHA_TEST_MODE === 'true';
  
  // В тестовом режиме CAPTCHA_SECRET не обязателен
  if (testMode) {
    return { isValid: true };
  }
  
  if (!secret) {
    return {
      isValid: false,
      error: "Configuration Error",
      message: "Missing SmartCaptcha configuration",
      details: "Environment variable CAPTCHA_SECRET is not set"
    };
  }
  
  return { isValid: true };
}

export {
  extractUserIP,
  extractSmartToken,
  validateSmartCaptchaToken,
  validateSmartCaptchaEnvironment,
};
