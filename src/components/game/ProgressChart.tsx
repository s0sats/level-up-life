import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

const ProgressChart: React.FC = () => {
  const { getMonthlyProgress } = useGame();
  const monthlyData = getMonthlyProgress();

  // Format data for the chart
  const chartData = monthlyData.map(item => ({
    date: new Date(item.date).getDate().toString(),
    percentage: item.percentage,
  }));

  // Calculate average
  const average = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.percentage, 0) / chartData.length)
    : 0;

  // Find best day
  const bestDay = chartData.reduce((best, item) => 
    item.percentage > best.percentage ? item : best, 
    { date: '-', percentage: 0 }
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">Dia {label}</p>
          <p className="text-lg font-bold text-neon-cyan">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card/50 border-border backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neon-green" />
          Evolução Mensal
        </CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Média:</span>
            <span className="font-bold text-neon-cyan">{average}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Melhor dia:</span>
            <span className="font-bold text-neon-yellow">{bestDay.date} ({bestDay.percentage}%)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Dados insuficientes</p>
              <p className="text-sm">Complete hábitos para ver seu progresso</p>
            </div>
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--neon-cyan))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="hsl(var(--neon-cyan))"
                  strokeWidth={2}
                  fill="url(#progressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
