import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Route, Clock, MapPin, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteData {
  id: string;
  routeId: string;
  distance: number;
  trafficLevel: "Low" | "Medium" | "High";
  baseTime: number;
  averageDeliveries: number;
  status: "active" | "maintenance" | "closed";
}

const mockRoutes: RouteData[] = [
  { id: "1", routeId: "RT001", distance: 15.5, trafficLevel: "Medium", baseTime: 45, averageDeliveries: 8, status: "active" },
  { id: "2", routeId: "RT002", distance: 22.3, trafficLevel: "High", baseTime: 65, averageDeliveries: 12, status: "active" },
  { id: "3", routeId: "RT003", distance: 8.7, trafficLevel: "Low", baseTime: 25, averageDeliveries: 5, status: "active" },
  { id: "4", routeId: "RT004", distance: 18.2, trafficLevel: "Medium", baseTime: 52, averageDeliveries: 9, status: "maintenance" },
  { id: "5", routeId: "RT005", distance: 31.8, trafficLevel: "High", baseTime: 85, averageDeliveries: 15, status: "closed" },
];

export default function Routes() {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<RouteData[]>(mockRoutes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteData | null>(null);
  const [formData, setFormData] = useState({
    routeId: "",
    distance: 0,
    trafficLevel: "Medium" as RouteData["trafficLevel"],
    baseTime: 0,
    status: "active" as RouteData["status"],
  });

  const handleAddRoute = () => {
    setEditingRoute(null);
    setFormData({
      routeId: "",
      distance: 0,
      trafficLevel: "Medium",
      baseTime: 0,
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEditRoute = (route: RouteData) => {
    setEditingRoute(route);
    setFormData({
      routeId: route.routeId,
      distance: route.distance,
      trafficLevel: route.trafficLevel,
      baseTime: route.baseTime,
      status: route.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoute) {
      setRoutes(prev => prev.map(route => 
        route.id === editingRoute.id 
          ? { 
              ...route, 
              ...formData, 
              averageDeliveries: Math.floor(formData.distance / 2) + Math.floor(Math.random() * 5)
            }
          : route
      ));
      toast({
        title: "Route Updated",
        description: `Route ${formData.routeId} has been updated successfully.`,
      });
    } else {
      const newRoute: RouteData = {
        id: Date.now().toString(),
        ...formData,
        averageDeliveries: Math.floor(formData.distance / 2) + Math.floor(Math.random() * 5),
      };
      setRoutes(prev => [...prev, newRoute]);
      toast({
        title: "Route Added",
        description: `Route ${formData.routeId} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
    toast({
      title: "Route Removed",
      description: "Route has been removed from the system.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: RouteData["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "maintenance":
        return <Badge variant="secondary">Maintenance</Badge>;
      case "closed":
        return <Badge variant="destructive">Closed</Badge>;
    }
  };

  const getTrafficBadge = (level: RouteData["trafficLevel"]) => {
    switch (level) {
      case "Low":
        return <Badge className="bg-success text-success-foreground">Low</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "High":
        return <Badge variant="destructive">High</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Route Matrix System
          </h1>
          <p className="text-lg text-muted-foreground">
            Neural pathway optimization for maximum velocity efficiency
          </p>
        </div>
        <Button onClick={handleAddRoute}>
          <Plus className="mr-2 h-4 w-4" />
          Add Route
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {routes.filter(r => r.status === "active").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(routes.reduce((sum, r) => sum + r.distance, 0) / routes.length).toFixed(1)} km
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(routes.reduce((sum, r) => sum + r.baseTime, 0) / routes.length).toFixed(0)} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route ID</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Traffic Level</TableHead>
                <TableHead>Base Time</TableHead>
                <TableHead>Avg Deliveries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.routeId}</TableCell>
                  <TableCell>{route.distance} km</TableCell>
                  <TableCell>{getTrafficBadge(route.trafficLevel)}</TableCell>
                  <TableCell>{route.baseTime} min</TableCell>
                  <TableCell>{route.averageDeliveries}</TableCell>
                  <TableCell>{getStatusBadge(route.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRoute(route)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Route Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? "Edit Route" : "Add New Route"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="routeId">Route ID</Label>
              <Input
                id="routeId"
                value={formData.routeId}
                onChange={(e) => setFormData(prev => ({ ...prev, routeId: e.target.value }))}
                placeholder="RT001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                min="0"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData(prev => ({ ...prev, distance: parseFloat(e.target.value) }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trafficLevel">Traffic Level</Label>
              <select
                id="trafficLevel"
                value={formData.trafficLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, trafficLevel: e.target.value as RouteData["trafficLevel"] }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseTime">Base Time (minutes)</Label>
              <Input
                id="baseTime"
                type="number"
                min="0"
                value={formData.baseTime}
                onChange={(e) => setFormData(prev => ({ ...prev, baseTime: parseInt(e.target.value) }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as RouteData["status"] }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRoute ? "Update" : "Add"} Route
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}