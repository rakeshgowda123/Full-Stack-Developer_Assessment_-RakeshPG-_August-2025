import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, User, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Driver {
  id: string;
  name: string;
  currentShiftHours: number;
  past7DayHours: number;
  status: "active" | "inactive" | "on-break";
  efficiency: number;
}

const mockDrivers: Driver[] = [
  { id: "1", name: "Rajesh Kumar", currentShiftHours: 6.5, past7DayHours: 45, status: "active", efficiency: 92 },
  { id: "2", name: "Priya Sharma", currentShiftHours: 4.2, past7DayHours: 38, status: "active", efficiency: 88 },
  { id: "3", name: "Amit Singh", currentShiftHours: 8.0, past7DayHours: 52, status: "on-break", efficiency: 95 },
  { id: "4", name: "Neha Patel", currentShiftHours: 2.1, past7DayHours: 28, status: "active", efficiency: 85 },
  { id: "5", name: "Rohit Gupta", currentShiftHours: 0, past7DayHours: 0, status: "inactive", efficiency: 78 },
];

export default function Drivers() {
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    currentShiftHours: 0,
    past7DayHours: 0,
    status: "active" as Driver["status"],
  });

  const handleAddDriver = () => {
    setEditingDriver(null);
    setFormData({
      name: "",
      currentShiftHours: 0,
      past7DayHours: 0,
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      currentShiftHours: driver.currentShiftHours,
      past7DayHours: driver.past7DayHours,
      status: driver.status,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDriver) {
      setDrivers(prev => prev.map(driver => 
        driver.id === editingDriver.id 
          ? { ...driver, ...formData, efficiency: Math.floor(Math.random() * 20) + 80 }
          : driver
      ));
      toast({
        title: "Driver Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newDriver: Driver = {
        id: Date.now().toString(),
        ...formData,
        efficiency: Math.floor(Math.random() * 20) + 80,
      };
      setDrivers(prev => [...prev, newDriver]);
      toast({
        title: "Driver Added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
    toast({
      title: "Driver Removed",
      description: "Driver has been removed from the system.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: Driver["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "on-break":
        return <Badge variant="secondary">On Break</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-success";
    if (efficiency >= 80) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Pilot Network Control
          </h1>
          <p className="text-lg text-muted-foreground">
            Elite pilot fleet management and performance analytics
          </p>
        </div>
        <Button onClick={handleAddDriver}>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <User className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {drivers.filter(d => d.status === "active").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Hours Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(drivers.reduce((sum, d) => sum + d.currentShiftHours, 0) / drivers.length).toFixed(1)}h
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(drivers.reduce((sum, d) => sum + d.efficiency, 0) / drivers.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Shift</TableHead>
                <TableHead>Weekly Hours</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell>{driver.currentShiftHours}h</TableCell>
                  <TableCell>{driver.past7DayHours}h</TableCell>
                  <TableCell className={getEfficiencyColor(driver.efficiency)}>
                    {driver.efficiency}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDriver(driver)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDriver(driver.id)}
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

      {/* Add/Edit Driver Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDriver ? "Edit Driver" : "Add New Driver"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Driver Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentShiftHours">Current Shift Hours</Label>
              <Input
                id="currentShiftHours"
                type="number"
                min="0"
                max="12"
                step="0.1"
                value={formData.currentShiftHours}
                onChange={(e) => setFormData(prev => ({ ...prev, currentShiftHours: parseFloat(e.target.value) }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="past7DayHours">Past 7 Days Hours</Label>
              <Input
                id="past7DayHours"
                type="number"
                min="0"
                max="84"
                value={formData.past7DayHours}
                onChange={(e) => setFormData(prev => ({ ...prev, past7DayHours: parseInt(e.target.value) }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Driver["status"] }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="active">Active</option>
                <option value="on-break">On Break</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingDriver ? "Update" : "Add"} Driver
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}