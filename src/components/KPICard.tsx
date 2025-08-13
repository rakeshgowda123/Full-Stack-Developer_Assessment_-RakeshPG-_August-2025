import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
  valueColor?: "default" | "success" | "warning" | "destructive";
}

export default function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className,
  valueColor = "default" 
}: KPICardProps) {
  const getValueColorClass = () => {
    switch (valueColor) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "destructive":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 border-0 bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="relative">
          <Icon className="h-5 w-5 text-primary group-hover:animate-pulse" />
          <div className="absolute inset-0 bg-primary rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn("text-2xl font-bold transition-colors", getValueColorClass())}>
            {value}
          </div>
          {trend && (
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full transition-all",
              trend.direction === "up" 
                ? "text-success bg-success/10" 
                : "text-destructive bg-destructive/10"
            )}>
              {trend.direction === "up" ? "↗" : "↘"}{trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}