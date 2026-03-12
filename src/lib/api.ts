// src/lib/api.ts
/**
 * API client for f.improve backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("session_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Request failed");
  }
  
  return response.json();
}

export const api = {
  // Jobs
  createJob: (data: {
    code: string;
    benchmark: string;
    goal: string;
    iterations: number;
  }) => fetchWithAuth("/api/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  
  getJob: (id: string) => fetchWithAuth(`/api/jobs/${id}`),
  
  listJobs: () => fetchWithAuth("/api/jobs"),
  
  // Experiments
  getExperiments: (jobId: string) => 
    fetchWithAuth(`/api/jobs/${jobId}/experiments`),
  
  downloadTsv: (jobId: string) => {
    window.open(`${API_URL}/api/experiments/${jobId}/tsv`, "_blank");
  },
};
