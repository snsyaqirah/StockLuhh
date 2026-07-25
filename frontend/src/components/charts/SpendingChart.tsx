import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';

interface SpendingData {
  category: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

// Validated 8-hue categorical palette (fixed order, CVD-checked adjacent pairs).
// Category names are shown directly via the legend below, satisfying the
// contrast relief rule for slices that sit under 3:1 on the surface.
const COLORS_LIGHT = [
  '#2a78d6', '#eb6834', '#1baf7a', '#eda100',
  '#e87ba4', '#008300', '#4a3aa7', '#e34948',
];
const COLORS_DARK = [
  '#3987e5', '#d95926', '#199e70', '#c98500',
  '#d55181', '#008300', '#9085e9', '#e66767',
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
  const { resolvedTheme } = useTheme();
  const COLORS = resolvedTheme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

  const formattedData = data.map((item) => ({
    ...item,
    name: categoryLabels[item.category] || item.category,
  }));

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="p-4 gradient-card shadow-card border border-border/50">
      <h3 className="font-display font-bold mb-4">Spending by Category</h3>
      
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
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-neu-flat-hover)',
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
