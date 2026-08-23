export type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "./database.types/shared";
export type { PublicCompositeTypes, PublicEnums, PublicFunctions, PublicSchema, PublicViews } from "./database.types/schema";
export type { PublicTables } from "./database.types/tables";

import type { PublicSchema } from "./database.types/schema";

export type Database = {
  public: PublicSchema;
};
