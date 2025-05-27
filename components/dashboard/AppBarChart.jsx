"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { crop: "Jagung", qty: 186 },
  { crop: "Cabai", qty: 305 },
  { crop: "Padi", qty: 237 },
];

const chartConfig = {
  qty: {
    label: "Qty(kg)",
    color: "var(--chart-6)",
  },
};

export function AppBarChart() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          right: 16,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="crop"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey="qty" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="qty"
          layout="vertical"
          fill="var(--color-qty)"
          radius={4}
        >
          <LabelList
            dataKey="crop"
            position="insideLeft"
            offset={8}
            className="fill-white font-bold"
            fontSize={12}
          />
          <LabelList
            dataKey="qty"
            position="insideRight"
            offset={8}
            className="fill-green-200"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
