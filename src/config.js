import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadConfig() {
  loadDotEnv();

  return {
    port: Number(process.env.PORT || 3000),
    aiProvider: process.env.AI_PROVIDER || 'auto',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openRouterModel: process.env.OPENROUTER_MODEL || 'openrouter/auto',
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || '',
    ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:7b'
  };
}

export function chooseProvider(config) {
  if (config.aiProvider && config.aiProvider !== 'auto') {
    return config.aiProvider;
  }

  if (config.geminiApiKey) return 'gemini';
  if (config.openRouterApiKey) return 'openrouter';
  if (config.ollamaBaseUrl) return 'ollama';
  return 'mock';
}

function loadDotEnv() {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
