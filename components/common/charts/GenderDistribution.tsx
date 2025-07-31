"use client"

import { Pie, PieChart, ResponsiveContainer } from "recharts"
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

export interface GenderDistributionProps {
  data: Record<"male" | "female" | "unknown", number>
}

export function GenderDistribution({ data }: GenderDistributionProps) {
  const chartData = [
    { gender: "Female", count: data.female, fill: "var(--chart-1)" },
    { gender: "Male", count: data.male, fill: "var(--chart-5)" },
    { gender: "Unknown", count: data.unknown, fill: "var(--chart-6)" },
  ]

  const chartConfig = {
    count: { label: "Count" },
    Male: { label: "Male", color: "var(--chart-1)" },
    Female: { label: "Female", color: "var(--chart-2)" },
    Unknown: { label: "Unknown", color: "var(--chart-3)" },
  } satisfies ChartConfig

  return (
    <Card className="shadow-lg overflow-hidden gap-2 2xl:gap-4 border-0">
      <CardHeader className="items-center">
        <CardTitle className="border-b-2 pb-4 dark:border-zinc-600">
          Gender Distribution
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 h-full">
        <ChartContainer config={chartConfig} className="w-full flex justify-center h-full">
          <div className="w-full max-w-[320px] aspect-[1/1] mx-auto -mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="gender"
                  outerRadius="75%"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
