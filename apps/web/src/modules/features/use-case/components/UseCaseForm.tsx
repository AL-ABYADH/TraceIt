"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import {
  CreatePrimaryUseCaseDto,
  createPrimaryUseCaseSchema,
  UseCaseImportanceLevel,
} from "@repo/shared-schemas";
import { Controller, useForm } from "react-hook-form";
import { useActors } from "../../actor/hooks/useActors";
import { useCreatePrimaryUseCase } from "../hooks/useCreatePrimaryUseCase";
import MultiSelect from "@/components/MultiSelect";

interface UseCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function UseCaseForm({ isOpen, onClose, projectId }: UseCaseFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePrimaryUseCaseDto>({
    resolver: zodResolver(createPrimaryUseCaseSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      importanceLevel: UseCaseImportanceLevel.MEDIUM,
      projectId,
      primaryActorIds: [],
      secondaryActorIds: [],
    },
  });

  const { data: actors = [], isLoading: actorsLoading } = useActors(projectId);

  const createUseCase = useCreatePrimaryUseCase({
    onSuccess: () => {
      reset();
      notifications.show({
        title: "Success",
        message: "Use case created successfully",
        color: "green",
      });
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
      const msg = err?.response?.data?.message ?? err?.message ?? "Create use case failed";
      notifications.show({
        title: "Error",
        message: msg,
        color: "red",
      });
    },
  });

  const onSubmit = (values: CreatePrimaryUseCaseDto) => {
    createUseCase.mutate(values);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const primarySelectedIds = watch("primaryActorIds");
  const secondarySelectedIds = watch("secondaryActorIds");

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Use Case" className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Name */}
        <InputField
          {...register("name")}
          label="Name"
          placeholder="Enter use case name"
          error={errors.name?.message}
          disabled={createUseCase.isPending || isSubmitting}
        />

        {/* Description */}
        <InputField
          {...register("description")}
          label="Description"
          placeholder="Enter description (optional)"
          error={errors.description?.message}
          disabled={createUseCase.isPending || isSubmitting}
        />

        {/* Importance Level */}
        <SelectField
          {...register("importanceLevel")}
          label="Importance Level"
          defaultValue={UseCaseImportanceLevel.MEDIUM}
          error={errors.importanceLevel?.message}
          disabled={createUseCase.isPending || isSubmitting}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </SelectField>

        {/* Primary Actors */}
        <Controller
          control={control}
          name="primaryActorIds"
          render={({ field }) => (
            <MultiSelect
              label="Primary Actors"
              placeholder="Select primary actors"
              options={actors
                .filter((a) => !secondarySelectedIds.includes(a.id))
                .map((a) => ({ value: a.id, label: `${a.name} (${a.subtype})` }))}
              value={field.value || []}
              onChange={(ids: string[]) => {
                // Remove from secondary if selected
                const newSecondary = secondarySelectedIds.filter((id) => !ids.includes(id));
                setValue("primaryActorIds", ids, { shouldValidate: true });
                setValue("secondaryActorIds", newSecondary, { shouldValidate: true });
              }}
              disabled={createUseCase.isPending || isSubmitting || actorsLoading}
              error={errors.primaryActorIds?.message}
            />
          )}
        />

        {/* Secondary Actors */}
        <Controller
          control={control}
          name="secondaryActorIds"
          render={({ field }) => (
            <MultiSelect
              label="Secondary Actors"
              placeholder="Select secondary actors"
              options={actors
                .filter((a) => !primarySelectedIds.includes(a.id))
                .map((a) => ({ value: a.id, label: `${a.name} (${a.subtype})` }))}
              value={field.value || []}
              onChange={(ids: string[]) => {
                const newPrimary = primarySelectedIds.filter((id) => !ids.includes(id));
                setValue("secondaryActorIds", ids, { shouldValidate: true });
                setValue("primaryActorIds", newPrimary, { shouldValidate: true });
              }}
              disabled={createUseCase.isPending || isSubmitting || actorsLoading}
              error={errors.secondaryActorIds?.message}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-4 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createUseCase.isPending || isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createUseCase.isPending || isSubmitting}
            className="px-6 "
          >
            {createUseCase.isPending || isSubmitting ? "Adding..." : "Add Use Case"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
