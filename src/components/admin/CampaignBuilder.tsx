"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CampaignBuilderProps = {
  starterMessage: string;
  starterRecommendation: string;
  campaignTypeLabels: Record<string, string>;
  audienceLabels: Record<string, string>;
  createCampaignAction: (formData: FormData) => void | Promise<void>;
};

type CopyResponse = {
  message?: string;
  recommendation?: string;
  provider?: "rules" | "openai";
  model?: string;
  error?: string;
};

const CampaignBuilder = ({
  starterMessage,
  starterRecommendation,
  campaignTypeLabels,
  audienceLabels,
  createCampaignAction,
}: CampaignBuilderProps) => {
  const [name, setName] = useState("Annual wellness reminder");
  const [campaignType, setCampaignType] = useState("wellness_check");
  const [channel, setChannel] = useState("whatsapp");
  const [audience, setAudience] = useState("recent_appointments");
  const [goal, setGoal] = useState("Invite patients to book a routine checkup.");
  const [message, setMessage] = useState(starterMessage);
  const [recommendation, setRecommendation] = useState(starterRecommendation);
  const [generationStatus, setGenerationStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCopy = async () => {
    setIsGenerating(true);
    setGenerationStatus("Generating campaign copy...");

    try {
      const response = await fetch("/api/campaigns/copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          campaignType,
          channel,
          audience,
          goal,
        }),
      });
      const data = (await response.json()) as CopyResponse;

      if (!response.ok) {
        throw new Error(data.error || "Could not generate campaign copy.");
      }

      setMessage(data.message || message);
      setRecommendation(data.recommendation || recommendation);
      setGenerationStatus(
        data.provider === "openai"
          ? `OpenAI draft ready${data.model ? ` with ${data.model}` : ""}.`
          : "Template fallback draft ready.",
      );
    } catch (error) {
      setGenerationStatus(
        error instanceof Error
          ? error.message
          : "Could not generate campaign copy.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription>Campaign builder</CardDescription>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Create AI campaign
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createCampaignAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="campaign_type">Type</Label>
              <Select
                id="campaign_type"
                name="campaign_type"
                value={campaignType}
                onChange={(event) => setCampaignType(event.target.value)}
              >
                {Object.entries(campaignTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select
                id="channel"
                name="channel"
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="voice">Voice</option>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Audience</Label>
            <Select
              id="audience"
              name="audience"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            >
              {Object.entries(audienceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Campaign goal</Label>
            <Input
              id="goal"
              name="goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={8}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            {recommendation}
          </div>
          {generationStatus ? (
            <p className="text-sm font-medium text-slate-600">
              {generationStatus}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={generateCopy} disabled={isGenerating}>
              <Sparkles />
              {isGenerating ? "Generating..." : "Generate AI copy"}
            </Button>
            <Button type="submit">
              <Sparkles />
              Save draft campaign
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CampaignBuilder;
