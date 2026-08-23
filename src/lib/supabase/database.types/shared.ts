export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "patient" | "doctor" | "receptionist" | "admin";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "rescheduled";
export type LeadStatus = "new" | "contacted" | "converted" | "closed" | "spam";
export type Channel = "email" | "sms" | "whatsapp" | "voice";
