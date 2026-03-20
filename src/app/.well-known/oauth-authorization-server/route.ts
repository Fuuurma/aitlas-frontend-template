// src/app/.well-known/oauth-authorization-server/route.ts
// OAuth Authorization Server Discovery Endpoint
// Required for MCP clients to discover OAuth endpoints
// See: https://better-auth.com/docs/plugins/mcp

import { oAuthDiscoveryMetadata } from "better-auth/plugins";
import { auth } from "@/server/auth";

export const GET = oAuthDiscoveryMetadata(auth);