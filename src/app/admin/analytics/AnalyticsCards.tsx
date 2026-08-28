import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getPercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

export const MetricCard = ({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: number;
  detail: string;
  icon: typeof Activity;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-4">
      <div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
      </div>
      <Icon className="size-8 text-primary" />
    </CardHeader>
    <CardContent className="text-sm text-slate-500">{detail}</CardContent>
  </Card>
);

export const Breakdown = ({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: Record<string, number>;
}) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.length > 0 ? (
          rows.map(([label, value]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                <span className="capitalize text-slate-700">
                  {label.replaceAll("_", " ")}
                </span>
                <span className="font-semibold text-slate-900">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${getPercent(value, total)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No data yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
