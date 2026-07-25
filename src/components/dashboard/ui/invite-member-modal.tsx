"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import InviteMemberIcon from "@/assets/icons/member-icon.svg";
import EmailIcon from "@/assets/icons/email-icon.svg";
import CloseIcon from "@/assets/icons/close.svg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteMemberSchema, type InviteMemberFormValues } from "@/schemas/project";

type InviteMemberModalProps = {
  isOpen: boolean;
  projectName?: string | null;
  onClose: () => void;
  onInvite: (email: string) => Promise<void> | void;
};

export function InviteMemberModal({
  isOpen,
  projectName,
  onClose,
  onInvite,
}: InviteMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(InviteMemberSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    onClose();
  };

  // Close modal when user presses Escape and prevent page scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, isSubmitting]);

  // Do not render the modal if it is closed
  if (!isOpen) return null;

  const onSubmit = async (data: InviteMemberFormValues) => {
    await onInvite(data.email.trim());

    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 backdrop-blur-sm md:items-center md:justify-center md:p-7"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full rounded-t-[28px] bg-white px-6 pb-8 pt-14 shadow-2xl md:w-[365px] md:rounded-lg md:p-7"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-surface-low md:flex">
              <InviteMemberIcon aria-hidden="true" />
            </div>

            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.7px] text-primary md:hidden">
              {projectName ?? "Project Name"}
            </p>

            <h2 className="mt-3 text-xl font-bold text-navy md:text-2xl">Invite Team Member</h2>
          </div>

          <button type="button" aria-label="Close modal" onClick={handleClose}>
            <CloseIcon aria-hidden="true" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-5 text-slate">
          Send an invitation to join the {projectName ?? "project"} workspace.
        </p>

        <div className="mb-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            error={errors.email?.message}
            iconElement={<EmailIcon aria-hidden="true" />}
            {...register("email")}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="h-11 w-full text-sm md:order-2 md:w-38"
          >
            Send Invitation
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-11 w-full text-sm md:order-1 md:w-38"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
