/**
 * Интеграционные тесты AI API
 * Требуют переменные окружения TOKEN и BASE_URL
 */

import { describe, it, expect, beforeAll } from 'vitest';
import dotenv from 'dotenv';
import { handler } from '../src/index.js';

dotenv.config();

describe('Интеграционные тесты с реальным AI API', () => {
  beforeAll(() => {
    // Устанавливаем тестовый режим для SmartCaptcha
    process.env.NODE_ENV = 'test';
    
    if (!process.env.AI_API_TOKEN || !process.env.AI_API_URL) {
      console.log('⚠️  Переменные окружения AI_API_TOKEN и AI_API_URL не найдены');
      console.log('   Создайте файл .env с переменными:');
      console.log('   AI_API_TOKEN=your_api_token_here');
      console.log('   AI_API_URL=https://api.deepseek.com/chat/completions');
      console.log('   CAPTCHA_SECRET=your_smartcaptcha_secret_here (опционально для тестов)');
      throw new Error('Требуются переменные окружения AI_API_TOKEN и AI_API_URL для интеграционных тестов');
    }
    console.log('🔗 Запуск интеграционных тестов с реальным AI API (тестовый режим SmartCaptcha)');
  });

  it('должен найти иконки поиска в Ant Design', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'smart-token': 'test-token-123'
      },
      body: JSON.stringify({
        platform: 'antd',
        request: 'поиск',
        qtty: 3
      })
    };
    const context = { awsRequestId: 'test-search' };

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.icon_names).toHaveLength(3);
    expect(body.meta.platform).toBe('antd');
    expect(body.meta.quantity).toBe(3);

    // Проверяем, что иконки содержат ключевые слова поиска
    const iconNames = body.data.icon_names.map(icon => icon.toLowerCase());
    expect(iconNames.some(icon => icon.includes('search'))).toBe(true);
    
    console.log('✅ Найденные иконки:', body.data.icon_names);
  });

  it('должен найти Unicode иконки для сердца', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'smart-token': 'test-token-456'
      },
      body: JSON.stringify({
        platform: 'unicode',
        request: 'сердце',
        qtty: 3
      })
    };
    const context = { awsRequestId: 'test-heart' };

    const result = await handler(event, context);

    // Проверяем успешный ответ
    expect(result.statusCode).toBe(200);
    
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.icon_names.length).toBeGreaterThan(0);
    expect(body.meta.platform).toBe('unicode');

    const iconNames = body.data.icon_names;
    expect(iconNames.some(icon => 
      icon.includes('U+2764') || icon.includes('U+1F496') || icon.includes('U+2665') || 
      icon.includes('U+1F495') || icon.includes('U+1F497') || icon.includes('U+1F498')
    )).toBe(true);
    
    console.log('✅ Найденные Unicode иконки:', body.data.icon_names);
  });

  it('должен найти иконки настроек в Material UI', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {
        'smart-token': 'test-token-789'
      },
      body: JSON.stringify({
        platform: 'mui',
        request: 'настройки',
        qtty: 1
      })
    };
    const context = { awsRequestId: 'test-settings' };

    const result = await handler(event, context);

    expect(result.statusCode).toBe(200);
    
    const body = JSON.parse(result.body);
    expect(body.success).toBe(true);
    expect(body.data.icon_names.length).toBeGreaterThan(0);
    expect(body.meta.platform).toBe('mui');

    const iconNames = body.data.icon_names.map(icon => icon.toLowerCase());
    expect(iconNames.some(icon => 
      icon.includes('settings') || icon.includes('gear') || icon.includes('config')
    )).toBe(true);
    
    console.log('✅ Найденные иконки:', body.data.icon_names);
  });

  it('должен вернуть ошибку 403 при отсутствии smart-token', async () => {
    const event = {
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({
        platform: 'antd',
        request: 'поиск',
        qtty: 3
      })
    };
    const context = { awsRequestId: 'test-no-token' };

    const result = await handler(event, context);

    expect(result.statusCode).toBe(403);
    
    const body = JSON.parse(result.body);
    expect(body.error).toBe('Missing Token');
    expect(body.message).toBe('SmartCaptcha token is required');
  });

  it('должен работать в продакшн режиме с реальным SmartCaptcha', async () => {
    // Временно переключаемся в продакшн режим
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.CAPTCHA_SECRET = 'test-secret';
    
    const event = {
      httpMethod: 'POST',
      headers: {
        'smart-token': 'invalid-token-for-testing'
      },
      body: JSON.stringify({
        platform: 'antd',
        request: 'поиск',
        qtty: 3
      })
    };
    const context = { awsRequestId: 'test-prod-mode' };

    const result = await handler(event, context);

    // В продакшн режиме с невалидным токеном должен быть 403
    expect(result.statusCode).toBe(403);
    
    const body = JSON.parse(result.body);
    // Может быть либо "Captcha Validation Failed" либо "Validation Service Error"
    expect(['Captcha Validation Failed', 'Validation Service Error']).toContain(body.error);
    
    // Восстанавливаем тестовый режим
    process.env.NODE_ENV = originalNodeEnv;
  });
});
