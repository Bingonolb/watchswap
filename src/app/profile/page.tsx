import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <div style={{ minHeight: "100dvh", background: "#f4f4f4" }}>
      <Navbar />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "36px 32px 60px" }}>
        <ProfileClient userId={user.id} email={user.email ?? ""} />
      </main>
    </div>
  );
}
