import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
  barColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  accentColor,
  barColor,
}) => {
  return (
    <Card className="bg-background shadow-lg rounded-md p-5 min-h-24 h-full border-zinc-200 dark:border-gray-800">
      <CardContent className="flex items-center justify-between p-0 h-full">
        <div className="flex items-center space-x-4">
          <div className={`h-16 w-1.5 rounded-full ${barColor}`} />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
        </div>

        <div className="relative w-12 h-12 flex items-center justify-center">
          <span
            className={`absolute left-2 top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full ${accentColor} z-0`}
          />
          <div className="relative z-10 text-zinc-700 dark:text-gray-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
