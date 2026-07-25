"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { acceptProjectInvitation } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils/helpers";

import NewInvitationIcon from "@/assets/icons/new-invitation.svg";

type InvitePageClientProps = {
  token: string | null;
};

export default function InvitePageClient({ token }: InvitePageClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptInvitation = async () => {
    if (!token) {
      toast.error("Invalid invitation link");
      return;
    }

    try {
      setIsLoading(true);

      const response = await acceptProjectInvitation(token);

      toast.success("Invitation accepted successfully");

      if (response?.status === 204) {
        router.push("/project");
      }
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <section className="relative w-full max-w-150 overflow-hidden rounded-2xl bg-white px-6 py-14 text-center">
        <div className="absolute left-0 top-0 h-1.5 w-full bg-primary" />

        <div className=" inline-flex items-center gap-2 rounded-full bg-[#E0E8FF] px-4 py-2">
          <NewInvitationIcon aria-hidden="true" />

          <span className="font-bold uppercase tracking-[2px] text-slate-darker text-[11px]">
            New Project Invitation
          </span>
        </div>

        <h3 className=" mt-5  text-[20px] font-bold leading-[1.15] tracking-[-1px] text-navy md:text-[30px]">
          You&apos;ve been invited to join <br />
          new project
        </h3>

        <Button
          type="button"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          onClick={handleAcceptInvitation}
          className=" mt-8  w-full"
        >
          Accept Invitation
        </Button>
      </section>
    </div>
  );
}
