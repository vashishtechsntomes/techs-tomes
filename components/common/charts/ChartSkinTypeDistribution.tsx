"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type SkinTypeDistributionData = Record<
  "dry" | "normal" | "oil" | "combination" | "unknown",
  number
>

interface ChartSkinTypeDistributionProps {
  chartData: SkinTypeDistributionData
}

const chartConfig = {
  dry: {
    label: "Dry",
    color: "var(--chart-1)",
  },
  normal: {
    label: "Normal",
    color: "var(--chart-2)",
  },
  oil: {
    label: "Oil",
    color: "var(--chart-3)",
  },
  combination: {
    label: "Combination",
    color: "var(--chart-4)",
  },
  unknown: {
    label: "Unknown",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartSkinTypeDistribution({
  chartData,
}: ChartSkinTypeDistributionProps) {
  const totalCustomers =
    chartData.dry +
    chartData.normal +
    chartData.oil +
    chartData.combination +
    chartData.unknown

  const chartFormatted = [{ ...chartData }]

  return (
    <Card className="border-0 shadow-lg overflow-hidden gap-0">
      <CardHeader>
        <CardTitle className="border-b-2 pb-4 dark:border-zinc-600">
          Skin Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-full">
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-8 gap-y-2 justify-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-1"></div>
              <span>Dry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-2"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-3"></div>
              <span>Oil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-4"></div>
              <span>Combination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-5"></div>
              <span>Unknown</span>
            </div>
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="w-full flex justify-center h-full"
        >
          <div className="w-full max-w-[380px] mx-auto">
            <RadialBarChart
              data={chartFormatted}
              width={380}
              height={380}
              endAngle={180}
              innerRadius={150}
              outerRadius={250}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 0}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {totalCustomers.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 50}
                            className="fill-muted-foreground text-base"
                          >
                            Total count
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="dry"
                stackId="a"
                fill="var(--color-dry)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="normal"
                stackId="a"
                fill="var(--color-normal)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="oil"
                stackId="a"
                fill="var(--color-oil)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="combination"
                stackId="a"
                fill="var(--color-combination)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="unknown"
                stackId="a"
                fill="var(--color-unknown)"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
