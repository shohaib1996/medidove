"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Reply, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ReplyToLeadFormProps = {
  leadId: string;
  email: string;
  defaultSubject: string;
  defaultMessage: string;
  action: (formData: FormData) => Promise<void>;
};

const ReplyToLeadForm = ({
  leadId,
  email,
  defaultSubject,
  defaultMessage,
  action,
}: ReplyToLeadFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Reply className="h-4 w-4" />
        Reply
      </Button>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("lead_id", leadId);
    formData.set("subject", subject);
    formData.set("message", message);

    setIsSending(true);

    try {
      await action(formData);
      toast.success(`Reply emailed to ${email}.`);
      setIsOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send reply.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-md border border-primary/30 bg-white p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-primary">
          Reply to {email}
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-slate-400 transition hover:text-slate-600"
          aria-label="Cancel reply"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor={`subject-${leadId}`}
          className="text-xs font-normal text-slate-500"
        >
          Subject
        </Label>
        <Input
          id={`subject-${leadId}`}
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor={`message-${leadId}`}
          className="text-xs font-normal text-slate-500"
        >
          Message
        </Label>
        <Textarea
          id={`message-${leadId}`}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSending || !message.trim()}>
          <Send className="h-4 w-4" />
          {isSending ? "Sending..." : "Send email"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          disabled={isSending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ReplyToLeadForm;
