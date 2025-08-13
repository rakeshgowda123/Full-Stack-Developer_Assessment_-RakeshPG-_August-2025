import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Activity, 
  Zap, 
  Flame, 
  Shield, 
  Navigation, 
  Box, 
  Menu,
  Power
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Analytics Hub", href: "/", icon: Activity },
  { name: "FleetOptimizer", href: "/simulation", icon: Zap },
  { name: "Driver Network", href: "/drivers", icon: Shield },
  { name: "Route Matrix", href: "/routes", icon: Navigation },
  { name: "Order Stream", href: "/orders", icon: Box },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Flame className="h-8 w-8 text-primary animate-pulse-slow" />
            <div className="absolute inset-0 bg-primary rounded-full blur-lg opacity-30 animate-glow"></div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
            FlameRunner Pro
          </span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <Button variant="ghost" className="w-full justify-start group hover:bg-destructive hover:text-destructive-foreground transition-all">
          <Power className="mr-3 h-5 w-5 group-hover:animate-pulse" />
          Logout System
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-gradient-to-b from-card to-muted/30 shadow-elegant backdrop-blur-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-background via-muted/20 to-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}