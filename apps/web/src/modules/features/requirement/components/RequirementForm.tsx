"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateRequirementDto, createRequirementSchema } from "@repo/shared-schemas";
import { useCreateRequirement } from "../hooks/useCreateRequirement";
import { useActors } from "../../actor/hooks/useActors";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import Dialog from "@/components/Dialog";
import InputField from "@/components/InputField";
import MultiSelect from "@/components/MultiSelect";
import Button from "@/components/Button";
import TextareaField from "@/components/TextAreaField";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

interface RequirementFormProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  projectId: string;
}

export default function RequirementForm({
  isOpen,
  onClose,
  useCaseId,
  projectId,
}: RequirementFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequirementDto>({
    resolver: zodResolver(createRequirementSchema),
    mode: "onSubmit",
    defaultValues: {
      operation: "",
      useCaseId: useCaseId,
      condition: "",
      actorIds: [],
    },
  });

  const { data: actors = [], isLoading: actorsLoading } = useActors(projectId);

  const createRequirement = useCreateRequirement(useCaseId, {
    onSuccess: () => {
      reset();
      setServerError(null);
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
      const msg = err?.response?.data?.message ?? err?.message ?? "Create requirement failed";
      setServerError(msg);
    },
  });

  const onSubmit = (values: CreateRequirementDto) => {
    setServerError(null);
    createRequirement.mutate(values);
  };

  const handleCancel = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Requirement" className="max-w-2xl">
      {(createRequirement.isPending || isSubmitting) && (
        <Loading
          isOpen={createRequirement.isPending || isSubmitting}
          message="Adding requirement..."
        />
      )}
      {serverError && <ErrorMessage message={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("operation")}
          label="Operation"
          placeholder="Enter the operation/action"
          error={errors.operation?.message}
          disabled={createRequirement.isPending || isSubmitting}
        />

        <TextareaField
          {...register("condition")}
          label="Condition (Optional)"
          placeholder="Enter condition if applicable"
          rows={3}
          error={errors.condition?.message}
          disabled={createRequirement.isPending || isSubmitting}
        />

        <Controller
          control={control}
          name="actorIds"
          render={({ field }) => (
            <MultiSelect
              label="Related Actors (Optional)"
              placeholder="Select actors involved"
              options={actors.map((actor) => ({
                value: actor.id,
                label: `${actor.name} (${actor.subtype})`,
              }))}
              value={field.value || []}
              onChange={(ids: string[]) => field.onChange(ids)}
              disabled={createRequirement.isPending || isSubmitting || actorsLoading}
              error={errors.actorIds?.message}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createRequirement.isPending || isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createRequirement.isPending || isSubmitting}
            className="px-6"
          >
            {createRequirement.isPending || isSubmitting ? "Adding..." : "Add Requirement"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
