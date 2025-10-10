"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import Loading from "@/components/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import {
  CreateSecondaryUseCaseDto,
  UpdateSecondaryUseCaseDto,
  createSecondaryUseCaseSchema,
  updateSecondaryUseCaseSchema,
} from "@repo/shared-schemas";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateSecondaryUseCase } from "../hooks/useCreateSecondaryUseCase";
import { useUpdateSecondaryUseCase } from "../hooks/useUpdateSecondaryUseCase";

interface SecondaryUseCaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  projectId: string;
  primaryUseCaseId: string;
  /** Provide exactly one of these when creating */
  requirementId?: string;
  exceptionId?: string;
  /** For edit mode */
  secondaryUseCaseId?: string;
  initialName?: string;
  /** Invalidate requirements list for this primary use case */
  invalidateUseCaseId: string;
}

export default function SecondaryUseCaseForm({
  isOpen,
  onClose,
  mode,
  projectId,
  primaryUseCaseId,
  requirementId,
  exceptionId,
  secondaryUseCaseId,
  initialName,
  invalidateUseCaseId,
}: SecondaryUseCaseFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultCreateValues: CreateSecondaryUseCaseDto = useMemo(
    () => ({
      name: initialName ?? "",
      projectId,
      primaryUseCaseId,
      requirementId,
      exceptionId,
    }),
    [initialName, projectId, primaryUseCaseId, requirementId, exceptionId],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSecondaryUseCaseDto | UpdateSecondaryUseCaseDto>({
    resolver: zodResolver(
      mode === "create" ? createSecondaryUseCaseSchema : updateSecondaryUseCaseSchema,
    ),
    mode: "onSubmit",
    defaultValues: mode === "create" ? defaultCreateValues : { name: initialName ?? "" },
  });

  useEffect(() => {
    if (mode === "create") {
      reset(defaultCreateValues);
    } else {
      reset({ name: initialName ?? "" });
    }
    setServerError(null);
  }, [mode, defaultCreateValues, initialName, reset]);

  const createMutation = useCreateSecondaryUseCase(invalidateUseCaseId, {
    onSuccess: () => handleSuccess("created"),
    onError: handleError,
  });

  const updateMutation = useUpdateSecondaryUseCase(secondaryUseCaseId ?? "", invalidateUseCaseId, {
    onSuccess: () => handleSuccess("updated"),
    onError: handleError,
  });

  const onSubmit = (values: any) => {
    setServerError(null);
    if (mode === "create") {
      const payload: CreateSecondaryUseCaseDto = {
        name: values.name,
        projectId,
        primaryUseCaseId,
        // Include only one of requirementId or exceptionId per spec
        requirementId: requirementId,
        exceptionId: exceptionId,
      };
      createMutation.mutate(payload);
    } else {
      const payload: UpdateSecondaryUseCaseDto = { name: values.name };
      updateMutation.mutate(payload);
    }
  };

  const handleSuccess = (action: string) => {
    reset();
    onClose();
  };

  function handleError(err: any) {
    const msg = err?.response?.data?.message ?? err?.message ?? "Operation failed";
    setServerError(msg);
  }

  const isPending = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Add Secondary Use Case" : "Edit Secondary Use Case"}
      className="max-w-lg"
    >
      {isPending && (
        <Loading
          isOpen
          message={
            mode === "create" ? "Adding secondary use case..." : "Updating secondary use case..."
          }
        />
      )}
      {serverError && <ErrorMessage message={serverError} />}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("name" as any)}
          label="Name"
          placeholder="Enter secondary use case name"
          error={(errors as any)?.name?.message as string}
          disabled={isPending}
        />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={isPending}
          >
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
