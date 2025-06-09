"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Ganti data chart sesuai kebutuhan
const chartData = [{ month: "january", cultivated: 1260, uncultivated: 200 }];

const chartConfig = {
  cultivated: {
    label: "Filled",
    color: "var(--chart-6)",
  },
  uncultivated: {
    label: "None",
    color: "var(--chart-6)",
  },
};

export function AppPieChart() {
  const totalLand = chartData[0].cultivated + chartData[0].uncultivated;
  const cultivatedLand = chartData[0].cultivated;
  const percentage = Math.floor((cultivatedLand / totalLand) * 100);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px] "
    >
      <RadialBarChart
        data={chartData}
        endAngle={360}
        innerRadius={80}
        outerRadius={130}
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
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {percentage.toLocaleString()}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      Cultivated
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="cultivated"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-cultivated, var(--chart-3))"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="uncultivated"
          fill="var(--color-uncultivated, var(--chart-2))"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
          style={{ opacity: 0.4 }}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
