"use client";

import { TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", yield: 186 },
  { month: "February", yield: 305 },
  { month: "March", yield: 237 },
  { month: "April", yield: 300 },
];

const chartConfig = {
  yield: {
    label: "Yield(kg)",
    color: "var(--chart-6)",
  },
};

export function AppAreaChart() {
  return (
    <ChartContainer config={chartConfig} className="max-h-[160px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="yield"
          type="natural"
          fill="var(--color-chart-6)"
          fillOpacity={0.4}
          stroke="var(--color-chart-6)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
