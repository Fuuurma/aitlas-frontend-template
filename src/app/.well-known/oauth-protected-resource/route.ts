// src/app/.well-known/oauth-protected-resource/route.ts
// OAuth Protected Resource Discovery Endpoint
// Required for MCP clients to discover protected resource metadata
// See: https://better-auth.com/docs/plugins/mcp

import { oAuthProtectedResourceMetadata } from "better-auth/plugins";
import { auth } from "@/server/auth";

export const GET = oAuthProtectedResourceMetadata(auth);