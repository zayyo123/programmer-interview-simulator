import { chooseProvider } from './config.js';
import { createFallbackInterviewerReply } from './interview.js';

export async function generateInterviewerReply({ config, session, answer, prompt }) {
  const provider = chooseProvider(config);

  try {
    if (provider === 'gemini') {
      return {
        provider,
        text: await callGemini(config, prompt)
      };
    }

    if (provider === 'openrouter') {
      return {
        provider,
        text: await callOpenRouter(config, prompt)
      };
    }

    if (provider === 'ollama') {
      return {
        provider,
        text: await callOllama(config, prompt)
      };
    }
  } catch (error) {
    console.error(`[ai:${provider}]`, error.message);
  }

  return {
    provider: 'mock',
    text: createFallbackInterviewerReply({ session, answer })
  };
}

async function callGemini(config, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

async function callOpenRouter(config, prompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openRouterApiKey}`,
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'Programmer Interview Simulator'
    },
    body: JSON.stringify({
      model: config.openRouterModel,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callOllama(config, prompt) {
  const response = await fetch(`${config.ollamaBaseUrl.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.ollamaModel,
      stream: false,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.message?.content?.trim() || '';
}
