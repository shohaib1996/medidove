import UnsubscribePage from "@/components/engagement/UnsubscribePage";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Unsubscribe | MediDove Clinic",
  description:
    "Opt out of MediDove clinic messages, email, or voice outreach.",
};

export default async function UnsubscribeRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialPhone = "";
  let initialEmail = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("id", user.id)
      .single();

    initialPhone = profile?.phone || "";
    initialEmail = user.email || "";
  }

  return (
    <UnsubscribePage
      initialPhone={initialPhone}
      initialEmail={initialEmail}
      afterSubmitHref={user ? "/portal/consents" : undefined}
    />
  );
}
