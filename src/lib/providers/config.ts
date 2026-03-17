// src/lib/providers/config.ts
import type { ProviderConfig } from "./types";

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "opencode",
    name: "OpenCode",
    requiresApiKey: true,
    apiKeyPrefix: "sk-",
    baseUrl: "https://opencode.ai/zen/v1",
    models: [
      { id: "glm-5", name: "GLM-5", contextWindow: 128000 },
      { id: "kimi-k2.5", name: "Kimi K2.5", contextWindow: 200000 },
      { id: "minimax-m2.5", name: "MiniMax M2.5", contextWindow: 200000, supportsVision: true },
      { id: "qwen-3.5", name: "Qwen 3.5 Plus", contextWindow: 128000 },
    ],
  },
  {
    id: "codex",
    name: "Codex (OpenAI)",
    requiresApiKey: true,
    apiKeyPrefix: "sk-",
    baseUrl: "https://api.openai.com/v1",
    models: [
      { id: "o3-mini", name: "o3 Mini", contextWindow: 200000 },
      { id: "gpt-4o", name: "GPT-4o", contextWindow: 128000, supportsVision: true },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", contextWindow: 128000, supportsVision: true },
      { id: "o1", name: "o1", contextWindow: 200000 },
      { id: "o1-mini", name: "o1 Mini", contextWindow: 128000 },
    ],
  },
  {
    id: "claude",
    name: "Claude Code",
    requiresApiKey: true,
    apiKeyPrefix: "sk-ant-",
    baseUrl: "https://api.anthropic.com/v1",
    models: [
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", contextWindow: 200000, supportsVision: true },
      { id: "claude-opus-4-20250514", name: "Claude Opus 4", contextWindow: 200000, supportsVision: true },
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", contextWindow: 200000, supportsVision: true },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", contextWindow: 200000, supportsVision: true },
    ],
  },
  {
    id: "aitlas",
    name: "Aitlas (Nexus)",
    requiresApiKey: false,
    models: [
      { id: "atlas-primary", name: "Atlas Primary", contextWindow: 200000 },
      { id: "atlas-coder", name: "Atlas Coder", contextWindow: 200000 },
      { id: "atlas-analyst", name: "Atlas Analyst", contextWindow: 200000 },
      { id: "atlas-architect", name: "Atlas Architect", contextWindow: 200000 },
    ],
  },
];

export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getModel(providerId: string, modelId: string) {
  const provider = getProvider(providerId);
  return provider?.models.find((m) => m.id === modelId);
}
