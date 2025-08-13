import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Play, RefreshCw, TrendingUp, Clock, DollarSign, Users } from "lucide-react";
import KPICard from "@/components/KPICard";

interface SimulationInputs {
  driverCount: number;
  startTime: string;
  maxHoursPerDay: number;
}

interface SimulationResults {
  totalProfit: number;
  efficiencyScore: number;
  onTimeDeliveries: number;
  totalDeliveries: number;
  fuelCost: number;
  penalties: number;
  bonuses: number;
}

export default function Simulation() {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<SimulationInputs>({
    driverCount: 15,
    startTime: "09:00",
    maxHoursPerDay: 8,
  });
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SimulationInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runSimulation = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock simulation results based on inputs
      const mockResults: SimulationResults = {
        totalProfit: Math.floor(150000 + (inputs.driverCount * 2000) + (Math.random() * 50000)),
        efficiencyScore: Math.min(95, 70 + (inputs.driverCount * 1.2) + (inputs.maxHoursPerDay * 2)),
        onTimeDeliveries: Math.floor(inputs.driverCount * 12 * (inputs.maxHoursPerDay / 8)),
        totalDeliveries: Math.floor(inputs.driverCount * 15 * (inputs.maxHoursPerDay / 8)),
        fuelCost: Math.floor(8000 + (inputs.driverCount * 400)),
        penalties: Math.floor(Math.random() * 5000),
        bonuses: Math.floor(Math.random() * 15000),
      };

      setResults(mockResults);
      setIsLoading(false);
      
      toast({
        title: "Simulation Complete",
        description: "Route optimization has been calculated successfully.",
      });
    }, 2000);
  };

  const resetSimulation = () => {
    setResults(null);
    setInputs({
      driverCount: 15,
      startTime: "09:00",
      maxHoursPerDay: 8,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
          FleetOptimizer Command
        </h1>
        <p className="text-lg text-muted-foreground">
          Advanced fleet simulation engine for mission-critical optimization
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Simulation Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Simulation Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="driverCount">Number of Available Drivers</Label>
              <Input
                id="driverCount"
                type="number"
                min="1"
                max="50"
                value={inputs.driverCount}
                onChange={(e) => handleInputChange("driverCount", parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Route Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={inputs.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxHours">Max Hours per Driver per Day</Label>
              <Input
                id="maxHours"
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={inputs.maxHoursPerDay}
                onChange={(e) => handleInputChange("maxHoursPerDay", parseFloat(e.target.value))}
              />
            </div>

            <Separator />

            <div className="flex space-x-3">
              <Button 
                onClick={runSimulation} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Simulation
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Parameters Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Drivers</p>
                <p className="text-2xl font-bold">{inputs.driverCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Time</p>
                <p className="text-2xl font-bold">{inputs.startTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Hours</p>
                <p className="text-2xl font-bold">{inputs.maxHoursPerDay}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Deliveries</p>
                <p className="text-2xl font-bold">{Math.floor(inputs.driverCount * 12)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulation Results */}
      {results && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Simulation Results</h2>
            <p className="text-muted-foreground">
              Updated KPIs based on your configuration
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Projected Profit"
              value={`₹${results.totalProfit.toLocaleString()}`}
              icon={DollarSign}
              valueColor="success"
            />
            <KPICard
              title="Efficiency Score"
              value={`${results.efficiencyScore.toFixed(1)}%`}
              icon={TrendingUp}
              valueColor={results.efficiencyScore > 85 ? "success" : "warning"}
            />
            <KPICard
              title="On-Time Rate"
              value={`${results.onTimeDeliveries}/${results.totalDeliveries}`}
              icon={Clock}
              valueColor="success"
            />
            <KPICard
              title="Active Drivers"
              value={inputs.driverCount}
              icon={Users}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-success">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Revenue:</span>
                    <span>₹{(results.totalProfit + results.fuelCost + results.penalties - results.bonuses).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Bonuses:</span>
                    <span>+₹{results.bonuses.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Profit:</span>
                    <span>₹{results.totalProfit.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fuel Costs:</span>
                    <span>₹{results.fuelCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Penalties:</span>
                    <span>-₹{results.penalties.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Costs:</span>
                    <span>₹{(results.fuelCost + results.penalties).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>On-Time Rate:</span>
                    <span>{((results.onTimeDeliveries / results.totalDeliveries) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg per Driver:</span>
                    <span>{(results.totalDeliveries / inputs.driverCount).toFixed(1)} orders</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit per Order:</span>
                    <span>₹{(results.totalProfit / results.totalDeliveries).toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}