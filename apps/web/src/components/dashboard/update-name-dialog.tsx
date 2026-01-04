"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { useUpdateUserName } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { cn } from "@repo/ui/utils";
import { toast } from "sonner";

export default function UpdateNameDialog({
  currentName,
  trigger,
}: {
  currentName: string;
  trigger?: string;
}) {
  const [open, setOpen] = useState(false);
  const { refetch } = authClient.useSession();
  const updateUserNameMutation = useUpdateUserName();

  const form = useForm({
    defaultValues: {
      name: currentName,
    },
    onSubmit: ({ value }) => {
      updateUserNameMutation.mutate(value.name, {
        onSuccess: async () => {
          toast.success("Name updated successfully");
          await refetch();
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to update name"
          );
        },
      });
    },
    validators: {
      onSubmit: z.object({
        name: z
          .string()
          .min(2, "Name must be at least 2 characters long")
          .max(50, "Name must be at most 50 characters long")
          .regex(
            /^[a-zA-Z0-9\s]+$/,
            "Name can only contain alphanumeric characters and spaces"
          ),
      }),
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger className={cn(buttonVariants({ variant: "default" }))}>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Name</DialogTitle>
          <DialogDescription>
            Change your display name. This will be visible to other users.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your name"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-destructive">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
          <DialogFooter>
            <form.Subscribe>
              {(state) => (
                <>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={
                      !state.canSubmit ||
                      state.isSubmitting ||
                      updateUserNameMutation.isPending
                    }
                  >
                    {state.isSubmitting || updateUserNameMutation.isPending
                      ? "Updating..."
                      : "Update Name"}
                  </Button>
                </>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
