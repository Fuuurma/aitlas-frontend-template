// src/app/(dashboard)/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Bot, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Start a conversation or explore agents.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <MessageSquare className="size-8 text-primary mb-2" />
            <CardTitle>Start Chatting</CardTitle>
            <CardDescription>
              Begin a conversation with an AI agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button className="w-full">
                New Chat
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <Bot className="size-8 text-primary mb-2" />
            <CardTitle>Browse Agents</CardTitle>
            <CardDescription>
              Discover AI agents for your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agents">
              <Button variant="outline" className="w-full">
                View Agents
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <CreditCard className="size-8 text-primary mb-2" />
            <CardTitle>Credits</CardTitle>
            <CardDescription>
              Manage your credits and usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/credits">
              <Button variant="outline" className="w-full">
                View Balance
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Get started with Aitlas in a few simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Add API Keys</p>
                <p className="text-sm text-muted-foreground">
                  Configure your OpenAI, Anthropic, or other provider keys
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Choose an Agent</p>
                <p className="text-sm text-muted-foreground">
                  Browse the agent store or start with default
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Start Chatting</p>
                <p className="text-sm text-muted-foreground">
                  Interact with your AI agent in real-time
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}