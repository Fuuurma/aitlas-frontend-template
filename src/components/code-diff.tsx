"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CodeDiffProps {
  oldCode: string;
  newCode: string;
  title?: string;
}

export function CodeDiff({ oldCode, newCode, title }: CodeDiffProps) {
  const diff = useMemo(() => {
    const oldLines = oldCode.split("\n");
    const newLines = newCode.split("\n");
    
    const result: Array<{
      type: "added" | "removed" | "unchanged";
      oldLine?: number;
      newLine?: number;
      content: string;
    }> = [];
    
    // Simple diff algorithm
    const maxLines = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      
      if (oldLine === newLine) {
        result.push({
          type: "unchanged",
          oldLine: i + 1,
          newLine: i + 1,
          content: oldLine || "",
        });
      } else {
        if (oldLine !== undefined) {
          result.push({
            type: "removed",
            oldLine: i + 1,
            content: oldLine,
          });
        }
        if (newLine !== undefined) {
          result.push({
            type: "added",
            newLine: i + 1,
            content: newLine,
          });
        }
      }
    }
    
    return result;
  }, [oldCode, newCode]);
  
  const additions = diff.filter((d) => d.type === "added").length;
  const deletions = diff.filter((d) => d.type === "removed").length;
  
  return (
    <Card>
      {title && (
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {title}
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline" className="text-green-500">
                +{additions}
              </Badge>
              <Badge variant="outline" className="text-red-500">
                -{deletions}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="font-mono text-xs overflow-x-auto">
          {diff.map((line, i) => (
            <div
              key={i}
              className={`flex ${
                line.type === "added"
                  ? "bg-green-500/10"
                  : line.type === "removed"
                  ? "bg-red-500/10"
                  : ""
              }`}
            >
              <div className="flex-shrink-0 w-12 text-right pr-2 text-muted-foreground border-r">
                {line.oldLine || ""}
              </div>
              <div className="flex-shrink-0 w-12 text-right pr-2 text-muted-foreground border-r">
                {line.newLine || ""}
              </div>
              <div
                className={`flex-shrink-0 w-6 text-center ${
                  line.type === "added"
                    ? "text-green-500"
                    : line.type === "removed"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {line.type === "added"
                  ? "+"
                  : line.type === "removed"
                  ? "-"
                  : " "}
              </div>
              <pre className="flex-1 px-2 whitespace-pre-wrap">{line.content}</pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}