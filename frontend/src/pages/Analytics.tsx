import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/hooks/useInventory';
import { Card } from '@/components/ui/card';
import { SpendingChart } from '@/components/charts/SpendingChart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { STATUS_CONFIG } from '@/types/inventory';

const STATUS_COLORS = {
  new: 'hsl(150, 45%, 45%)',
  'in-use': 'hsl(150, 35%, 50%)',
  low: 'hsl(38, 90%, 55%)',
  finished: 'hsl(12, 75%, 55%)',
};

export default function Analytics() {
  const { stats, spendingByCategory, items } = useInventory();

  const statusData = Object.entries(stats.statusCounts).map(([status, count]) => ({
    name: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label,
    value: count,
    status,
  }));

  const categoryData = spendingByCategory
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)
    .map((item) => ({
      ...item,
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your inventory trends and spending
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="p-4 gradient-card shadow-card border border-border/50">
            <h3 className="font-semibold mb-4">Item Status Distribution</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => 
                      percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                    }
                    labelLine={false}
                  >
                    {statusData.map((entry) => (
                      <Cell 
                        key={entry.status} 
                        fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center gap-2 text-sm">
                  <div 
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Spending by Category */}
          <SpendingChart data={spendingByCategory} />
        </div>

        {/* Spending Bar Chart */}
        <Card className="p-4 gradient-card shadow-card border border-border/50">
          <h3 className="font-semibold mb-4">Top Categories by Spending</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  tickFormatter={(v) => `RM${v}`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value: number) => [`RM${value.toFixed(2)}`, 'Spending']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 gradient-card shadow-card border border-border/50 text-center">
            <p className="text-3xl font-bold">{stats.totalItems}</p>
            <p className="text-sm text-muted-foreground">Total Items</p>
          </Card>
          <Card className="p-4 gradient-card shadow-card border border-border/50 text-center">
            <p className="text-3xl font-bold">{stats.totalQuantity}</p>
            <p className="text-sm text-muted-foreground">Total Units</p>
          </Card>
          <Card className="p-4 gradient-card shadow-card border border-border/50 text-center">
            <p className="text-3xl font-bold">RM{stats.totalSpending.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </Card>
          <Card className="p-4 gradient-card shadow-card border border-border/50 text-center">
            <p className="text-3xl font-bold">{spendingByCategory.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
