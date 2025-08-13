import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "@/components/KPICard";
import { 
  Coins, 
  Rocket, 
  Timer, 
  Gauge,
  Box,
  UserCheck,
  MapPin,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

// Mock data for charts
const deliveryData = [
  { name: "Mon", onTime: 45, late: 5 },
  { name: "Tue", onTime: 52, late: 8 },
  { name: "Wed", onTime: 48, late: 2 },
  { name: "Thu", onTime: 61, late: 9 },
  { name: "Fri", onTime: 55, late: 5 },
  { name: "Sat", onTime: 40, late: 3 },
  { name: "Sun", onTime: 35, late: 2 },
];

const fuelCostData = [
  { name: "Core Operations", value: 68, color: "#ff5722" },
  { name: "Priority Boost", value: 22, color: "#ff9800" },
  { name: "Network Premium", value: 10, color: "#ffc107" },
];

const efficiencyTrend = [
  { month: "Jan", efficiency: 78 },
  { month: "Feb", efficiency: 82 },
  { month: "Mar", efficiency: 85 },
  { month: "Apr", efficiency: 88 },
  { month: "May", efficiency: 92 },
  { month: "Jun", efficiency: 89 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
          Mission Control Center
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time fleet performance analytics and operational intelligence
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Revenue Stream"
          value="₹3,47,920"
          icon={Coins}
          trend={{ value: 18.7, direction: "up" }}
          valueColor="success"
        />
        <KPICard
          title="Performance Index"
          value="94.3%"
          icon={Rocket}
          trend={{ value: 6.4, direction: "up" }}
          valueColor="success"
        />
        <KPICard
          title="Mission Success Rate"
          value="347/372"
          icon={Timer}
          trend={{ value: 1.8, direction: "down" }}
          valueColor="warning"
        />
        <KPICard
          title="Fuel Burn Rate"
          value="₹8,720"
          icon={Gauge}
          trend={{ value: 12.3, direction: "down" }}
          valueColor="success"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-6 md:grid-cols-4">
        <KPICard
          title="Active Pilots"
          value="31"
          icon={UserCheck}
        />
        <KPICard
          title="Route Networks"
          value="189"
          icon={MapPin}
        />
        <KPICard
          title="Queue Status"
          value="8"
          icon={Box}
          valueColor="warning"
        />
        <KPICard
          title="System Alerts"
          value="2"
          icon={AlertCircle}
          valueColor="destructive"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mission Success Analytics */}
        <Card className="shadow-elegant border-0 bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-primary">Mission Success Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="onTime" fill="#ff5722" name="Success" />
                <Bar dataKey="late" fill="#e91e63" name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operational Cost Matrix */}
        <Card className="shadow-elegant border-0 bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-primary">Operational Cost Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fuelCostData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fuelCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {fuelCostData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Evolution */}
      <Card className="shadow-elegant border-0 bg-gradient-to-br from-card to-muted/20">
        <CardHeader>
          <CardTitle className="text-primary">Performance Evolution (6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={efficiencyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#ff5722" 
                strokeWidth={4}
                dot={{ fill: "#ff5722", strokeWidth: 3, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}