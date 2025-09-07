module.exports.handler = async function (event, context) {
  // CORS заголовки для всех ответов
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };

  // Обработка preflight OPTIONS запросов
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight successful" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        Allow: "POST",
      },
      body: JSON.stringify({
        error: "Method Not Allowed",
        message: "Only POST requests are supported for this endpoint",
        details: "Use POST method with JSON request body",
      }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing request body",
        details:
          "Request must contain JSON body with platform and request fields",
      }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (parseError) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Invalid JSON",
        message: "Invalid JSON in request body",
        details: "Check JSON syntax. Error: " + parseError.message,
      }),
    };
  }

  if (!body.platform) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Missing Required Field",
        message: "Missing required field: platform",
        details:
          "Specify icon platform (antd, mui, fa, feather, ion, bootstrap, tabler, remix, hero, lucide, unicode)",
      }),
    };
  }

  if (!body.request) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Missing Required Field",
        message: "Missing required field: request",
        details: "Specify icon description for search",
      }),
    };
  }

  const validPlatforms = new Set([
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

  if (!validPlatforms.has(body.platform)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Invalid Platform",
        message: "Invalid icon platform specified",
        details: `Supported platforms: ${Array.from(validPlatforms).join(", ")}. Received: ${body.platform}`,
        supported_platforms: Array.from(validPlatforms),
      }),
    };
  }

  if (typeof body.request !== "string" || body.request.trim().length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Invalid Request",
        message: "Request cannot be empty",
        details: "Request field must contain icon description text",
      }),
    };
  }

  const trimmedRequest = body.request.trim();
  if (trimmedRequest.length > 50) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Request Too Long",
        message: "Request description exceeds maximum length",
        details:
          "Maximum request length is 50 characters. Current length: " +
          trimmedRequest.length,
        current_length: trimmedRequest.length,
        max_allowed: 50,
      }),
    };
  }

  const token = process.env["TOKEN"];
  const baseUrl = process.env["BASE_URL"];

  if (!token) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Configuration Error",
        message: "Missing authorization token",
        details: "Environment variable TOKEN is not set",
      }),
    };
  }

  if (!baseUrl) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Configuration Error",
        message: "Missing base URL",
        details: "Environment variable BASE_URL is not set",
      }),
    };
  }

  const prompt = {
    model: "deepseek-coder",
    messages: [
      {
        role: "system",
        content:
          'Ты — эксперт по дизайн-системам и иконографике. Твоя задача — по описанию от пользователя (request) подобрать три точных названия иконок из указанной библиотеки (platform).\n\nКРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА:\n1. Отвечай ТОЛЬКО в формате валидного JSON без каких-либо пояснений.\n2. Структура ответа ДОЛЖНА быть строго такой:\n{\n  "icon_names": ["string", "string", "string"]\n}\n3. Всегда возвращай ровно три варианта иконок.\n4. Первая иконка в списке — наиболее подходящая по запросу, остальные — альтернативные варианты.\n5. Используй только официальные названия иконок из запрашиваемой платформы.\n6. Для платформы unicode возвращай коды в формате ["U+XXXX", "U+XXXX", "U+XXXX"].\n\nДоступные библиотеки иконок:\n- Ant Design Icons (antd)\n- Material Design Icons (mui) \n- FontAwesome (fa)\n- Feather Icons (feather)\n- Ionicons (ion)\n- Bootstrap Icons (bootstrap)\n- Tabler Icons (tabler)\n- Remix Icon (remix)\n- Heroicons (hero)\n- Lucide (lucide)\n- Unicode (unicode)\n\nФормат именования для каждой библиотеки:\n- Ant Design: Name + Outlined/Filled (Example: HistoryOutlined)\n- Material UI: Name + Outlined/Filled/Rounded/Sharp (Example: HistoryOutlined)\n- FontAwesome: fa-* (Example: fa-history)\n- Feather: lowercase-with-dashes (Example: history)\n- Ionicons: ion-* (Example: ion-md-history)\n- Unicode: U+XXXX (Example: U+1F4AC)',
      },
      {
        role: "user",
        content: JSON.stringify({
          platform: body.platform,
          request: trimmedRequest,
        }),
      },
    ],
    temperature: 0.1,
    max_tokens: 50,
  };

  try {
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
        `AI API returned error: ${response.status} ${response.statusText}. Response: ${errorText}`,
      );
    }

    const json = await response.json();

    if (
      !json.choices ||
      !Array.isArray(json.choices) ||
      json.choices.length === 0
    ) {
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
        `AI returned invalid JSON: ${parseError.message}. Content: ${message.content}`,
      );
    }

    if (!responseData.icon_names) {
      throw new Error("AI response missing icon_names field");
    }

    if (!Array.isArray(responseData.icon_names)) {
      throw new Error("icon_names field must be an array");
    }

    if (responseData.icon_names.length !== 3) {
      throw new Error(
        `Expected 3 icons, received: ${responseData.icon_names.length}`,
      );
    }

    const invalidIcons = responseData.icon_names.filter(
      (icon) => typeof icon !== "string",
    );
    if (invalidIcons.length > 0) {
      throw new Error(`Invalid icon formats: ${invalidIcons.join(", ")}`);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: responseData,
        meta: {
          platform: body.platform,
          request: trimmedRequest,
          model: prompt.model,
        },
      }),
    };
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      requestBody: body,
      timestamp: new Date().toISOString(),
    });

    return {
      statusCode: error.message.includes("AI API returned error") ? 502 : 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Processing Error",
        message: "Error processing request",
        details: error.message,
        request_id: context.awsRequestId,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
