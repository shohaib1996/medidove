import type { AppointmentStatus, Channel, LeadStatus, UserRole } from "./shared";
import type { PublicTables } from "./tables";

export type PublicViews = Record<string, never>;

export type PublicFunctions = {
  is_admin: {
    Args: Record<PropertyKey, never>;
    Returns: boolean;
  };
};

export type PublicEnums = {
  user_role: UserRole;
  appointment_status: AppointmentStatus;
  lead_status: LeadStatus;
  communication_channel: Channel;
};

export type PublicCompositeTypes = Record<string, never>;

export type PublicSchema = {
  Tables: PublicTables;
  Views: PublicViews;
  Functions: PublicFunctions;
  Enums: PublicEnums;
  CompositeTypes: PublicCompositeTypes;
};
