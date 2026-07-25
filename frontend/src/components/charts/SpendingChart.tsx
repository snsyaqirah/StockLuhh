import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface SpendingData {
  category: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

const COLORS = [
  'hsl(210, 70%, 55%)', // blue - toiletries
  'hsl(340, 70%, 65%)', // pink - skincare
  'hsl(270, 60%, 60%)', // purple - haircare
  'hsl(190, 70%, 50%)', // cyan - dental
  'hsl(150, 60%, 45%)', // emerald - cleaning
  'hsl(40, 85%, 55%)',  // amber - grocery
  'hsl(25, 85%, 55%)',  // orange - snacks
  'hsl(350, 70%, 60%)', // rose - beverages
  'hsl(0, 70%, 55%)',   // red - medicine
  'hsl(220, 15%, 50%)', // slate - other
];

const categoryLabels: Record<string, string> = {
  toiletries: 'Toiletries',
  skincare: 'Skincare',
  haircare: 'Haircare',
  dental: 'Dental',
  cleaning: 'Cleaning',
  grocery: 'Grocery',
  snacks: 'Snacks',
  beverages: 'Beverages',
  medicine: 'Medicine',
  other: 'Other',
};

export function SpendingChart({ data }: SpendingChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    name: categoryLabels[item.category] || item.category,
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="p-4 gradient-card shadow-card border border-border/50">
      <h3 className="font-semibold mb-4">Spending by Category</h3>
      
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No spending data yet</p>
      ) : (
        <>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {formattedData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-200 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`RM${value.toFixed(2)}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-card)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Total Spending</p>
            <p className="text-xl font-bold">RM{total.toFixed(2)}</p>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            {formattedData.slice(0, 4).map((item, index) => (
              <div key={item.category} className="flex items-center gap-2 text-sm">
                <div 
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
