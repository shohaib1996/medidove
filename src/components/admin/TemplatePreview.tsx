"use client";

import { useState } from "react";
import { Eye, MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

export type PreviewTemplate = {
  id: string;
  name: string;
  channel: "email" | "sms" | "whatsapp" | "voice";
  category: string;
  body: string;
  variables: string[];
  is_active: boolean;
};

const defaultValues: Record<string, string> = {
  patient_name: "Demo Patient",
  appointment_time: "Tomorrow at 10:30 AM",
  department: "Dental Care",
  doctor_name: "Dr. Michael Chen",
  clinic_name: "MediDove",
  phone_number: "+1 555 0100",
};

const renderTemplate = (body: string, values: Record<string, string>) =>
  body.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
    return values[key] || `{{${key}}}`;
  });

const getVariables = (template: PreviewTemplate | undefined) => {
  if (!template) {
    return [];
  }

  const bodyVariables = Array.from(
    template.body.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g),
  ).map((match) => match[1]);

  return Array.from(new Set([...template.variables, ...bodyVariables]));
};

const TemplatePreview = ({ templates }: { templates: PreviewTemplate[] }) => {
  const activeTemplates = templates.filter((template) => template.is_active);
  const [selectedId, setSelectedId] = useState(activeTemplates[0]?.id || "");
  const selectedTemplate =
    activeTemplates.find((template) => template.id === selectedId) ||
    activeTemplates[0];
  const variables = getVariables(selectedTemplate);
  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const renderedMessage = selectedTemplate
    ? renderTemplate(selectedTemplate.body, values)
    : "";

  const updateValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardDescription>Preview</CardDescription>
        <CardTitle className="flex items-center gap-2">
          <Eye className="size-5 text-primary" />
          Render patient message
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-preview">Template</Label>
            <select
              id="template-preview"
              value={selectedTemplate?.id || ""}
              onChange={(event) => setSelectedId(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {activeTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTemplate ? (
            <div className="flex flex-wrap gap-2">
              <Badge className="capitalize">{selectedTemplate.channel}</Badge>
              <Badge variant="secondary" className="capitalize">
                {selectedTemplate.category.replaceAll("_", " ")}
              </Badge>
            </div>
          ) : null}

          {variables.length > 0 ? (
            <div className="grid gap-3">
              {variables.map((variable) => (
                <div key={variable} className="space-y-2">
                  <Label htmlFor={`preview-${variable}`}>
                    {variable.replaceAll("_", " ")}
                  </Label>
                  <Input
                    id={`preview-${variable}`}
                    value={values[variable] || ""}
                    onChange={(event) => updateValue(variable, event.target.value)}
                    placeholder={`{{${variable}}}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              No variables found for the selected template.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            <MessageSquareText className="size-3.5" />
            Patient-facing output
          </div>
          <Textarea
            readOnly
            value={
              renderedMessage ||
              "Create and activate a template to preview patient messages."
            }
            className="min-h-64 bg-white"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(renderedMessage)}
            disabled={!renderedMessage}
          >
            Copy preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatePreview;
