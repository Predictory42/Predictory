import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Card, CardContent } from "@/shadcn/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shadcn/ui/chart";

export type OptionData = {
  title: string;
  votes: number;
  value: number | string;
  index: number | undefined;
};

interface PredictionChartProps {
  options: OptionData[];
}

const generateMockTimeSeriesData = (options: OptionData[]) => {
  const dates = [];
  const now = new Date();

  for (let i = 9; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
  }

  return dates.map((date) => {
    const dataPoint: Record<string, any> = { date };

    options.forEach((option) => {
      const base = option.votes;
      const min = Math.max(0, base * 0.7);
      const max = base * 1.3;
      dataPoint[`option-${option.index}`] = Math.floor(
        min + Math.random() * (max - min),
      );
    });

    return dataPoint;
  });
};

export const PredictionChart: React.FC<PredictionChartProps> = ({
  options,
}) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const timeSeriesData = generateMockTimeSeriesData(options);

  const barChartData = options.map((option) => ({
    name:
      option.title.length > 15
        ? `${option.title.substring(0, 15)}...`
        : option.title,
    votes: option.votes,
  }));

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const chartConfig = {
    votes: {
      label: "Votes",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full bg-transparent border-none">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Options Distribution</h3>
          <Tabs
            defaultValue="bar"
            value={chartType}
            onValueChange={(value) => setChartType(value as "bar" | "line")}
          >
            <TabsList>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ChartContainer config={chartConfig}>
          {chartType === "bar" ? (
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="votes" fill="hsl(var(--chart-1))" />
            </BarChart>
          ) : (
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Legend />
              {options.map((option, index) => (
                <Line
                  key={option.index}
                  type="monotone"
                  dataKey={`option-${option.index}`}
                  name={
                    option.title.length > 15
                      ? `${option.title.substring(0, 15)}...`
                      : option.title
                  }
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
