import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { DiscoverClient } from "./DiscoverClient";

export default async function DiscoverPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <>
      <Navbar />
      <DiscoverClient userId={user.id} />
    </>
  );
}
