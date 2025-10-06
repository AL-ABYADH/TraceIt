"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import Loading from "@/components/Loading";
import MultiSelect from "@/components/MultiSelect";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateRequirementDto,
  UpdateRequirementDto,
  createRequirementSchema,
  updateRequirementSchema,
} from "@repo/shared-schemas";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useActors } from "../../actor/hooks/useActors";
import { useCreateRequirement } from "../hooks/useCreateRequirement";
import { useUpdateRequirement } from "../hooks/useUpdateRequirement";
import { usePrimaryUseCaseDetail } from "../../use-case/hooks/usePrimaryUseCaseDetail";
import { useRequirementDetail } from "../hooks/useRequirementDetail";
import { useRequirementExceptionDetail } from "../hooks/useRequirementExceptionDetail";
import RequirementPreview from "./RequirementPreview";

interface RequirementFormProps {
  isOpen: boolean;
  onClose: () => void;
  validatedUseCaseId: string;
  useCaseId?: string; // only for create under main
  projectId: string;
  parentRequirementId?: string; // create under S
  exceptionId?: string; // create under E
  // edit mode
  mode?: "create" | "edit";
  requirementId?: string; // edit target
  initialData?: Partial<CreateRequirementDto & { actorIds?: string[] }> &
    Partial<UpdateRequirementDto>;
}

export default function RequirementForm({
  isOpen,
  onClose,
  validatedUseCaseId,
  useCaseId,
  projectId,
  parentRequirementId,
  exceptionId,
  mode = "create",
  requirementId,
  initialData,
}: RequirementFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequirementDto | UpdateRequirementDto>({
    resolver: zodResolver(mode === "create" ? createRequirementSchema : updateRequirementSchema),
    mode: "onSubmit",
    defaultValues:
      mode === "create"
        ? {
            operation: "",
            condition: undefined,
            useCaseId,
            parentRequirementId,
            exceptionId,
            actorIds: [],
          }
        : {
            operation: initialData?.operation ?? "",
            condition: initialData?.condition,
            actorIds: initialData?.actorIds ?? [],
          },
  });

  const { data: actors = [], isLoading: actorsLoading } = useActors(projectId);

  // Allowed actor ids: from use case, parent requirement, or the requirement associated with an exception
  const { data: useCaseDetail, isLoading: useCaseLoading } =
    usePrimaryUseCaseDetail(validatedUseCaseId);
  const useCaseActorIds = [
    ...(useCaseDetail?.primaryActors?.map((a) => a.id) ?? []),
    ...(useCaseDetail?.secondaryActors?.map((a) => a.id) ?? []),
  ];

  const { data: parentRequirementDetail, isLoading: parentRequirementLoading } =
    useRequirementDetail(parentRequirementId, !!parentRequirementId);

  // If creating under exception, fetch exception then its parent requirement detail to get actors
  const { data: exceptionDetail, isLoading: exceptionLoading } = useRequirementExceptionDetail(
    exceptionId,
    !!exceptionId,
  );
  const parentOfExceptionRequirementId = (exceptionDetail as any)?.requirement?.id as
    | string
    | undefined;
  const { data: exceptionParentRequirementDetail, isLoading: exceptionParentRequirementLoading } =
    useRequirementDetail(parentOfExceptionRequirementId, !!parentOfExceptionRequirementId);

  const allowedActorIdsSet = new Set<string>([
    ...useCaseActorIds,
    ...((parentRequirementDetail as any)?.actors?.map((a: any) => a.id) ?? []),
    ...((exceptionParentRequirementDetail as any)?.actors?.map((a: any) => a.id) ?? []),
  ]);

  const filteredActorOptions = actors
    .filter((actor) => allowedActorIdsSet.size === 0 || allowedActorIdsSet.has(actor.id))
    .map((actor) => ({ value: actor.id, label: `${actor.name} (${actor.subtype})` }));

  const allowedActorsLoading =
    actorsLoading ||
    useCaseLoading ||
    (!!parentRequirementId && parentRequirementLoading) ||
    (!!exceptionId && exceptionLoading) ||
    (!!parentOfExceptionRequirementId && exceptionParentRequirementLoading);

  // Always use validatedUseCaseId for cache invalidation
  const createRequirement = useCreateRequirement(validatedUseCaseId, {
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

  const updateRequirement = useUpdateRequirement(requirementId ?? "", validatedUseCaseId, {
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
      const msg = err?.response?.data?.message ?? err?.message ?? "Update requirement failed";
      setServerError(msg);
    },
  });

  const onSubmit = (values: any) => {
    setServerError(null);

    if (mode === "create") {
      const payload: Partial<CreateRequirementDto> = { ...values };
      if (!payload.useCaseId) delete payload.useCaseId;
      if (!payload.exceptionId) delete payload.exceptionId;
      if (!payload.parentRequirementId) delete payload.parentRequirementId;
      createRequirement.mutate(payload as CreateRequirementDto);
    } else {
      const updatePayload: UpdateRequirementDto = {
        operation: values.operation || undefined,
        condition: values.condition || undefined,
        actorIds: values.actorIds || [],
      };
      updateRequirement.mutate(updatePayload);
    }
  };

  const handleCancel = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const operation = watch("operation");
  const condition = watch("condition");

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add Requirement" : "Edit Requirement"}
      className="max-w-2xl"
    >
      {((mode === "create" &&
        (createRequirement.isPending || isSubmitting || createRequirement.isUpdating)) ||
        (mode === "edit" && (updateRequirement.isPending || isSubmitting))) && (
        <Loading
          isOpen={createRequirement.isPending || isSubmitting || createRequirement.isUpdating}
          message={
            mode === "create"
              ? createRequirement.isUpdating
                ? "Updating requirements list..."
                : "Adding requirement..."
              : "Updating requirement..."
          }
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

        <InputField
          {...register("condition", {
            setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
          })}
          label="Condition (Optional)"
          placeholder="Enter condition if applicable"
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
              options={filteredActorOptions}
              value={field.value || []}
              onChange={(ids: string[]) => field.onChange(ids)}
              disabled={
                (mode === "create" ? createRequirement.isPending : updateRequirement.isPending) ||
                isSubmitting ||
                allowedActorsLoading
              }
              error={errors.actorIds?.message}
            />
          )}
        />

        <RequirementPreview operation={operation} condition={condition} />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={
              (mode === "create" ? createRequirement.isPending : updateRequirement.isPending) ||
              isSubmitting
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={
              (mode === "create" ? createRequirement.isPending : updateRequirement.isPending) ||
              isSubmitting
            }
            className="px-6"
          >
            {mode === "create"
              ? createRequirement.isPending || isSubmitting
                ? "Adding..."
                : "Add Requirement"
              : updateRequirement.isPending || isSubmitting
                ? "Updating..."
                : "Update Requirement"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
