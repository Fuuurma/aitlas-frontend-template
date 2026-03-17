// src/lib/nexus-client.ts
import { env } from "@/env";

export interface CreditBalance {
  balance: number;
  formatted: string;
}

export interface NexusTask {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  goal: string;
  agentSlug?: string;
  creditsUsed: number;
  createdAt: string;
  steps?: TaskStep[];
}

export interface TaskStep {
  id: string;
  stepNumber: number;
  type: "PLAN" | "ACTION" | "REFLECT" | "FINAL";
  content: string;
  status: "pending" | "running" | "completed" | "failed";
}

const isMock = !env.NEXUS_API_URL || env.NEXUS_API_URL.includes("localhost");

// Mock data for development
const mockCredits: CreditBalance = {
  balance: 500,
  formatted: "500",
};

const mockTasks: NexusTask[] = [];

export const nexus = {
  async getCredits(userId: string): Promise<CreditBalance> {
    if (isMock) {
      return mockCredits;
    }
    const response = await fetch(`${env.NEXUS_API_URL}/api/credits/${userId}`, {
      headers: {
        Authorization: `Bearer ${env.FURMA_INTERNAL_SECRET}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch credits");
    }
    return response.json();
  },

  async dispatchTask(input: {
    userId: string;
    agentSlug?: string;
    goal: string;
    model?: string;
    creditBudget?: number;
  }): Promise<{ taskId: string }> {
    if (isMock) {
      const taskId = `mock-task-${Date.now()}`;
      mockTasks.push({
        id: taskId,
        status: "pending",
        goal: input.goal,
        agentSlug: input.agentSlug,
        creditsUsed: 0,
        createdAt: new Date().toISOString(),
      });
      return { taskId };
    }
    const response = await fetch(`${env.NEXUS_API_URL}/api/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.FURMA_INTERNAL_SECRET}`,
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      throw new Error("Failed to dispatch task");
    }
    return response.json();
  },

  async getTask(taskId: string): Promise<NexusTask | null> {
    if (isMock) {
      return mockTasks.find((t) => t.id === taskId) || null;
    }
    const response = await fetch(`${env.NEXUS_API_URL}/api/v1/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${env.FURMA_INTERNAL_SECRET}`,
      },
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  },

  async listTasks(userId: string): Promise<NexusTask[]> {
    if (isMock) {
      return mockTasks.filter((t) => t.id.includes(userId));
    }
    const response = await fetch(`${env.NEXUS_API_URL}/api/v1/tasks?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${env.FURMA_INTERNAL_SECRET}`,
      },
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  },
};
