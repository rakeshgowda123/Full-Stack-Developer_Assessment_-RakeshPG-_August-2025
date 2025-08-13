import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Package, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  orderId: string;
  value: number;
  assignedRoute: string;
  deliveryTimestamp: string;
  status: "pending" | "in-transit" | "delivered" | "delayed";
  customerName: string;
}

const mockOrders: Order[] = [
  { 
    id: "1", 
    orderId: "ORD001", 
    value: 1250, 
    assignedRoute: "RT001", 
    deliveryTimestamp: "2025-01-15T14:30:00", 
    status: "delivered",
    customerName: "Aarav Sharma"
  },
  { 
    id: "2", 
    orderId: "ORD002", 
    value: 850, 
    assignedRoute: "RT002", 
    deliveryTimestamp: "2025-01-15T16:00:00", 
    status: "in-transit",
    customerName: "Priya Singh"
  },
  { 
    id: "3", 
    orderId: "ORD003", 
    value: 2100, 
    assignedRoute: "RT003", 
    deliveryTimestamp: "2025-01-15T11:45:00", 
    status: "delivered",
    customerName: "Rohit Kumar"
  },
  { 
    id: "4", 
    orderId: "ORD004", 
    value: 650, 
    assignedRoute: "RT001", 
    deliveryTimestamp: "2025-01-15T18:30:00", 
    status: "delayed",
    customerName: "Neha Patel"
  },
  { 
    id: "5", 
    orderId: "ORD005", 
    value: 1800, 
    assignedRoute: "RT004", 
    deliveryTimestamp: "2025-01-16T09:00:00", 
    status: "pending",
    customerName: "Amit Gupta"
  },
];

export default function Orders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    orderId: "",
    value: 0,
    assignedRoute: "",
    deliveryTimestamp: "",
    status: "pending" as Order["status"],
    customerName: "",
  });

  const handleAddOrder = () => {
    setEditingOrder(null);
    setFormData({
      orderId: "",
      value: 0,
      assignedRoute: "",
      deliveryTimestamp: "",
      status: "pending",
      customerName: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      orderId: order.orderId,
      value: order.value,
      assignedRoute: order.assignedRoute,
      deliveryTimestamp: order.deliveryTimestamp.slice(0, 16), // Format for datetime-local input
      status: order.status,
      customerName: order.customerName,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOrder) {
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...order, ...formData, deliveryTimestamp: formData.deliveryTimestamp + ":00" }
          : order
      ));
      toast({
        title: "Order Updated",
        description: `Order ${formData.orderId} has been updated successfully.`,
      });
    } else {
      const newOrder: Order = {
        id: Date.now().toString(),
        ...formData,
        deliveryTimestamp: formData.deliveryTimestamp + ":00",
      };
      setOrders(prev => [...prev, newOrder]);
      toast({
        title: "Order Added",
        description: `Order ${formData.orderId} has been added successfully.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
    toast({
      title: "Order Removed",
      description: "Order has been removed from the system.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-success text-success-foreground">Delivered</Badge>;
      case "in-transit":
        return <Badge variant="secondary">In Transit</Badge>;
      case "delayed":
        return <Badge variant="destructive">Delayed</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
    }
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalValue = orders.reduce((sum, order) => sum + order.value, 0);
  const deliveredOrders = orders.filter(o => o.status === "delivered").length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const avgOrderValue = orders.length > 0 ? totalValue / orders.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Order Stream Interface
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time order processing and mission tracking hub
          </p>
        </div>
        <Button onClick={handleAddOrder}>
          <Plus className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              ₹{totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {deliveredOrders}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{avgOrderValue.toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Delivery Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>₹{order.value.toLocaleString()}</TableCell>
                  <TableCell>{order.assignedRoute}</TableCell>
                  <TableCell>{formatDateTime(order.deliveryTimestamp)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
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

      {/* Add/Edit Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOrder ? "Edit Order" : "Add New Order"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                value={formData.orderId}
                onChange={(e) => setFormData(prev => ({ ...prev, orderId: e.target.value }))}
                placeholder="ORD001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Order Value (₹)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedRoute">Assigned Route</Label>
              <Input
                id="assignedRoute"
                value={formData.assignedRoute}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedRoute: e.target.value }))}
                placeholder="RT001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryTimestamp">Delivery Time</Label>
              <Input
                id="deliveryTimestamp"
                type="datetime-local"
                value={formData.deliveryTimestamp}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryTimestamp: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Order["status"] }))}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingOrder ? "Update" : "Add"} Order
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}