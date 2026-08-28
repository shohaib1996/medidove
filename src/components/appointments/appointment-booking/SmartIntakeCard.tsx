import { Bot, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IntakeResult } from "./types";

type SmartIntakeCardProps = {
  intakeResult: IntakeResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
};

const SmartIntakeCard = ({
  intakeResult,
  isAnalyzing,
  onAnalyze,
}: SmartIntakeCardProps) => (
  <Card className="border-teal-100 bg-teal-50/60 shadow-none">
    <CardHeader>
      <CardDescription>Smart Intake</CardDescription>
      <CardTitle className="flex items-center gap-2 text-xl">
        <Sparkles className="size-5 text-primary" />
        Routing suggestion
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm leading-6 text-slate-600">
        Analyze the reason for visit to suggest department, doctor type,
        urgency, and admin notes. This is routing support only, not diagnosis.
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={onAnalyze}
        disabled={isAnalyzing}
      >
        <Bot />
        {isAnalyzing ? "Analyzing..." : "Analyze request"}
      </Button>

      {intakeResult && (
        <div className="grid gap-3 rounded-lg border border-teal-200 bg-white p-4">
          {intakeResult.safetyMessage && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {intakeResult.safetyMessage}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {intakeResult.provider === "openai"
                ? "Smart suggestion"
                : "Rules fallback"}
            </Badge>
            {intakeResult.model && (
              <span className="text-xs text-slate-500">
                {intakeResult.model}
              </span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Department
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {intakeResult.suggestedDepartment}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Doctor
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">
                {intakeResult.suggestedDoctor}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Urgency
              </p>
              <Badge className="mt-1 capitalize">{intakeResult.urgency}</Badge>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {intakeResult.adminNote}
          </p>
          {intakeResult.matchedSignals.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {intakeResult.matchedSignals.map((signal) => (
                <Badge key={signal} variant="secondary">
                  {signal}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

export default SmartIntakeCard;
