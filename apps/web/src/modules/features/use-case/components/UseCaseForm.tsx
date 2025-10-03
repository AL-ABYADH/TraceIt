"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import Loading from "@/components/Loading";
import MultiSelect from "@/components/MultiSelect";
import SelectField from "@/components/SelectField";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import {
  CreatePrimaryUseCaseDto,
  UseCaseImportanceLevel,
  createPrimaryUseCaseSchema,
} from "@repo/shared-schemas";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useActors } from "../../actor/hooks/useActors";
import { useCreatePrimaryUseCase } from "../hooks/useCreatePrimaryUseCase";
import { usePrimaryUseCaseDetail } from "../hooks/usePrimaryUseCaseDetail";
import { useUpdatePrimaryUseCase } from "../hooks/useUpdatePrimaryUseCase";

interface UseCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  mode: "create" | "edit";
  useCaseId?: string;
  /** Optional initial data to skip fetching */
  initialData?: CreatePrimaryUseCaseDto & {
    primaryActors?: { id: string }[];
    secondaryActors?: { id: string }[];
  };
}

export default function UseCaseForm({
  isOpen,
  onClose,
  projectId,
  mode,
  useCaseId,
  initialData,
}: UseCaseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

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

  // Fetch only if editing AND no initial data provided
  const {
    data: detail,
    isLoading: detailLoading,
    isError: detailError,
    error: detailErr,
  } = usePrimaryUseCaseDetail(useCaseId ?? "", undefined, {
    enabled: mode === "edit" && !!useCaseId && !initialData,
  });

  const createMutation = useCreatePrimaryUseCase({
    onSuccess: () => handleSuccess("created"),
    onError: handleError,
  });

  const updateMutation = useUpdatePrimaryUseCase(useCaseId ?? "", {
    onSuccess: () => handleSuccess("updated"),
    onError: handleError,
  });

  useEffect(() => {
    const source = initialData ?? detail;
    if (mode === "edit" && source) {
      reset({
        name: source.name,
        description: source.description ?? "",
        importanceLevel: source.importanceLevel,
        projectId,
        primaryActorIds: source.primaryActors?.map((a) => a.id) ?? [],
        secondaryActorIds: source.secondaryActors?.map((a) => a.id) ?? [],
      });
    } else if (mode === "create") {
      reset({
        name: "",
        description: "",
        importanceLevel: UseCaseImportanceLevel.MEDIUM,
        projectId,
        primaryActorIds: [],
        secondaryActorIds: [],
      });
    }
    setServerError(null);
  }, [mode, initialData, detail, projectId, reset]);

  const onSubmit = (values: CreatePrimaryUseCaseDto) => {
    setServerError(null);
    if (mode === "create") createMutation.mutate(values);
    else updateMutation.mutate(values);
  };

  const handleSuccess = (action: string) => {
    notifications.show({
      title: "Success",
      message: `Use case ${action} successfully`,
      color: "green",
    });
    reset();
    onClose();
  };

  function handleError(err: any) {
    setServerError(null);
    if (isApiValidationError(err)) {
      const serverErrors = (err as any).data.errors as ApiFieldValidationError[];
      serverErrors.forEach(({ field, message }) =>
        setError(field as any, { type: "server", message }),
      );
      return;
    }
    const msg = err?.response?.data?.message ?? err?.message ?? "Operation failed";
    setServerError(msg);
  }

  const handleCancel = () => {
    reset();
    setServerError(null);
    onClose();
  };

  useEffect(() => {
    if (mode === "edit" && (initialData || detail)) {
      reset({
        ...(initialData ?? detail),
        primaryActorIds: (initialData?.primaryActors ?? detail?.primaryActors ?? []).map(
          (a) => a.id,
        ),
        secondaryActorIds: (initialData?.secondaryActors ?? detail?.secondaryActors ?? []).map(
          (a) => a.id,
        ),
      });
    }
  }, [mode, initialData, detail, reset]);

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    isSubmitting ||
    actorsLoading ||
    (mode === "edit" && !initialData && detailLoading);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add Use Case" : "Edit Use Case"}
      className="max-w-lg"
    >
      {isPending && <Loading isOpen message="Processing..." />}
      {serverError && <ErrorMessage message={serverError} />}
      {detailError && !initialData && (
        <ErrorMessage message={detailErr?.message ?? "Failed to load use case details"} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("name")}
          label="Name"
          placeholder="Enter use case name"
          error={errors.name?.message}
          disabled={isPending}
        />

        <InputField
          {...register("description", {
            setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
          })}
          label="Description"
          placeholder="Enter description (optional)"
          error={errors.description?.message}
          disabled={isPending}
        />

        <SelectField
          {...register("importanceLevel")}
          label="Importance Level"
          defaultValue={UseCaseImportanceLevel.MEDIUM}
          error={errors.importanceLevel?.message}
          disabled={isPending}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </SelectField>

        <Controller
          control={control}
          name="primaryActorIds"
          render={({ field }) => {
            const primaryValue = field.value || [];
            const secondaryValue = watch("secondaryActorIds") || [];

            return (
              <MultiSelect
                label="Primary Actors"
                placeholder="Select primary actors"
                options={actors
                  .filter((a) => !secondaryValue.includes(a.id))
                  .map((a) => ({ value: a.id, label: `${a.name} (${a.subtype})` }))}
                value={primaryValue}
                onChange={(ids: string[]) => {
                  const newSecondary = secondaryValue.filter((id) => !ids.includes(id));
                  setValue("primaryActorIds", ids, { shouldValidate: true });
                  setValue("secondaryActorIds", newSecondary, { shouldValidate: true });
                }}
                disabled={isPending}
                error={errors.primaryActorIds?.message}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="secondaryActorIds"
          render={({ field }) => {
            const secondaryValue = field.value || [];
            const primaryValue = watch("primaryActorIds") || [];

            return (
              <MultiSelect
                label="Secondary Actors"
                placeholder="Select secondary actors"
                options={actors
                  .filter((a) => !primaryValue.includes(a.id))
                  .map((a) => ({ value: a.id, label: `${a.name} (${a.subtype})` }))}
                value={secondaryValue}
                onChange={(ids: string[]) => {
                  const newPrimary = primaryValue.filter((id) => !ids.includes(id));
                  setValue("secondaryActorIds", ids, { shouldValidate: true });
                  setValue("primaryActorIds", newPrimary, { shouldValidate: true });
                }}
                disabled={isPending}
                error={errors.secondaryActorIds?.message}
              />
            );
          }}
        />

        <div className="flex items-center justify-end gap-3 pt-4 mt-8">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="px-6">
            {isPending
              ? mode === "create"
                ? "Adding..."
                : "Updating..."
              : mode === "create"
                ? "Add"
                : "Update"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
