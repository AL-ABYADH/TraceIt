"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications"; // ✅ still used for success only
import { ActorSubtype, AddActorDto, addActorSchema } from "@repo/shared-schemas";
import { useForm } from "react-hook-form";
import { useAddActor } from "../hooks/useAddActor";

interface ActorFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function ActorForm({ isOpen, onClose, projectId }: ActorFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddActorDto>({
    resolver: zodResolver(addActorSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      subType: ActorSubtype.HUMAN,
      projectId,
    },
  });

  const createActor = useAddActor({
    onSuccess: () => {
      reset();
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
    },
  });

  const onSubmit = (values: AddActorDto) => createActor.mutate(values);
  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Actor" className="max-w-lg">
      {createActor.isPending && (
        <Loading message="Adding actor..." isOpen={createActor.isPending} />
      )}

      {createActor.isError && (
        <ErrorMessage message={createActor.error?.message ?? "Something went wrong"} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("name")}
          label="Name"
          placeholder="Enter actor name"
          error={errors.name?.message}
          disabled={createActor.isPending || isSubmitting}
        />

        <SelectField
          {...register("subType")}
          label="Subtype"
          error={errors.subType?.message}
          disabled={createActor.isPending || isSubmitting}
          defaultValue={ActorSubtype.HUMAN}
        >
          <option value="HUMAN">Human</option>
          <option value="SOFTWARE">Software</option>
          <option value="HARDWARE">Hardware</option>
          <option value="AI_AGENT">AI Agent</option>
          <option value="EVENT">Event</option>
        </SelectField>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createActor.isPending || isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={createActor.isPending || isSubmitting} className="px-6">
            {createActor.isPending || isSubmitting ? "Adding..." : "Add Actor"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
