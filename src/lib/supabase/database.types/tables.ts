import type { AiTables } from "./tables/ai";
import type { CampaignTables } from "./tables/campaigns";
import type { CommunicationTables } from "./tables/communications";
import type { ContentTables } from "./tables/content";
import type { CoreTables } from "./tables/core";
import type { PatientCareTables } from "./tables/patient-care";

export type PublicTables = CoreTables &
  ContentTables &
  PatientCareTables &
  AiTables &
  CommunicationTables &
  CampaignTables;

export type { AiTables } from "./tables/ai";
export type { CampaignTables } from "./tables/campaigns";
export type { CommunicationTables } from "./tables/communications";
export type { ContentTables } from "./tables/content";
export type { CoreTables } from "./tables/core";
export type { PatientCareTables } from "./tables/patient-care";
