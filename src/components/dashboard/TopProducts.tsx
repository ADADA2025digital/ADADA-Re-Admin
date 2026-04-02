import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface TopProductsProps {
  data: { name: string; sales: number }[]
  totalRevenue: number
}

export function TopProducts({ data, totalRevenue }: TopProductsProps) {
  const maxSales = Math.max(...data.map(p => p.sales))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((product) => {
            const percentage = (product.sales / maxSales) * 100
            const revenue = product.sales * 199.99 // Average price for demo
            
            return (
              <div key={product.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(revenue)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground min-w-[40px]">
                    {product.sales} sold
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
