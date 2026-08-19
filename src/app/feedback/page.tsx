"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { MessageSquareHeart, Send, Star } from "lucide-react";
import PublicHeader from "@/components/marketing/PublicHeader";
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

const categories = [
  "general",
  "appointment",
  "doctor",
  "billing",
  "reception",
  "follow-up",
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          category: formData.get("category"),
          message: formData.get("message"),
          appointmentId: formData.get("appointment_id"),
          rating,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit feedback.");
      }

      event.currentTarget.reset();
      setRating(5);
      toast.success("Feedback submitted successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit feedback.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white md:px-8">
          <Image
            src="/assets/img/slider/slider-bg-2.jpg"
            alt="Patient feedback"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="relative mx-auto max-w-7xl">
            <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15">
              <MessageSquareHeart className="h-3.5 w-3.5" />
              Patient feedback
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal md:text-5xl">
              Share your MediDove care experience
            </h1>
            <p className="mt-5 max-w-2xl leading-8 text-slate-300">
              Feedback is reviewed by the clinic team and smart triage helps
              prioritize urgent service concerns.
            </p>
          </div>
        </section>

        <section className="px-4 py-12 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardDescription>Quality review</CardDescription>
                <CardTitle>Submit feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        defaultValue="general"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={rating === value ? "default" : "outline"}
                          onClick={() => setRating(value)}
                        >
                          <Star className="h-4 w-4" />
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointment_id">Appointment ID</Label>
                    <Input
                      id="appointment_id"
                      name="appointment_id"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Feedback</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={8}
                      required
                      placeholder="Tell the clinic what went well or what needs attention."
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How feedback is used</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                <p>
                  Feedback is scored for sentiment and follow-up priority so staff
                  can quickly identify service issues.
                </p>
                <p>
                  This is not an emergency channel. Use local emergency services
                  for urgent medical symptoms.
                </p>
                <Button asChild variant="outline">
                  <Link href="/portal">Open portal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <ToastContainer />
    </div>
  );
}
