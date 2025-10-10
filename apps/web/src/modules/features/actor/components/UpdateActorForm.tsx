"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputField from "@/components/InputField";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActorDto, UpdateActorDto, updateActorSchema } from "@repo/shared-schemas";
import { useForm } from "react-hook-form";
import { useUpdateActor } from "../hooks/useUpdateActor";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

interface UpdateActorFormProps {
  isOpen: boolean;
  onClose: () => void;
  actor: ActorDto;
}

export default function UpdateActorForm({ isOpen, onClose, actor }: UpdateActorFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateActorDto>({
    resolver: zodResolver(updateActorSchema),
    mode: "onSubmit",
    defaultValues: { name: actor.name },
  });

  const updateActor = useUpdateActor(actor.id, {
    onSuccess: () => {
      setErrorMsg(null);
      onClose();
    },
    onError: (err: any) => {
      if (isApiValidationError(err)) {
        const serverErrors = (err as any).data.errors as ApiFieldValidationError[];
        serverErrors.forEach(({ field, message }) =>
          setError(field as any, { type: "server", message }),
        );
        return;
      }
      const msg = err?.response?.data?.message ?? err?.message ?? "Update actor failed";
      setErrorMsg(msg);
    },
  });

  const onSubmit = (values: UpdateActorDto) => {
    setErrorMsg(null);
    updateActor.mutate(values);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Actor" className="max-w-lg">
      {(updateActor.isPending || isSubmitting) && (
        <Loading isOpen={updateActor.isPending || isSubmitting} message="Updating actor..." />
      )}

      {errorMsg && <ErrorMessage message={errorMsg} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("name")}
          label="Name"
          placeholder="Enter actor name"
          error={errors.name?.message}
          disabled={updateActor.isPending || isSubmitting}
        />

        <div className="flex items-center justify-end gap-3 pt-4 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={updateActor.isPending || isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={updateActor.isPending || isSubmitting} className="px-6">
            {updateActor.isPending || isSubmitting ? "Updating..." : "Update Actor"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
