// src/lib/providers/types.ts
export type Provider = "opencode" | "codex" | "claude" | "aitlas";

export interface Model {
  id: string;
  name: string;
  contextWindow: number;
  supportsVision?: boolean;
}

export interface ProviderConfig {
  id: Provider;
  name: string;
  models: Model[];
  requiresApiKey: boolean;
  apiKeyPrefix?: string;
  baseUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  provider: Provider;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamEvent {
  type: "content.delta" | "turn.started" | "turn.completed" | "error";
  content?: string;
  delta?: string;
}
