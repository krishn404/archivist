"use client";
import { authClient } from "@/lib/auth-client";
import UpdateNameDialog from "@/components/dashboard/update-name-dialog";
import { Button } from "@repo/ui/components/ui/button";

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard is active</h1>
      <p>Welcome {session.user.name}</p>
      <UpdateNameDialog
        currentName={session.user.name}
        trigger={"Update Name"}
      />
    </div>
  );
}
