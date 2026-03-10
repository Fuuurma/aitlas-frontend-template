// src/app/(dashboard)/agents/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Zap, FileText, Code, Search, TrendingUp } from "lucide-react";

const AGENTS = [
  {
    id: "researcher",
    name: "Research Agent",
    description: "Search and synthesize information from the web",
    icon: Search,
    status: "available",
  },
  {
    id: "writer",
    name: "Content Writer",
    description: "Generate blog posts, articles, and documentation",
    icon: FileText,
    status: "available",
  },
  {
    id: "developer",
    name: "Code Assistant",
    description: "Write, debug, and explain code",
    icon: Code,
    status: "available",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    description: "Analyze data and create visualizations",
    icon: TrendingUp,
    status: "coming-soon",
  },
  {
    id: "automation",
    name: "Workflow Automator",
    description: "Automate repetitive tasks and workflows",
    icon: Zap,
    status: "coming-soon",
  },
  {
    id: "custom",
    name: "Custom Agent",
    description: "Build your own agent with custom prompts",
    icon: Bot,
    status: "coming-soon",
  },
];

export default async function AgentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Store</h1>
        <p className="text-muted-foreground">
          Discover and use AI agents for your tasks
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <agent.icon className="size-8 text-primary mb-2" />
              <CardTitle className="flex items-center gap-2">
                {agent.name}
                {agent.status === "coming-soon" && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={agent.status === "coming-soon"}
              >
                {agent.status === "available" ? "Use Agent" : "Notify Me"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}