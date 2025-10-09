"use client";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import ErrorMessage from "@/components/ErrorMessage";
import InputField from "@/components/InputField";
import Loading from "@/components/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateRequirementException } from "../hooks/useCreateRequirementException";
import {
  CreateRequirementExceptionDto,
  createRequirementExceptionSchema,
  UpdateRequirementExceptionDto,
  updateRequirementExceptionSchema,
} from "@repo/shared-schemas";
import { useUpdateRequirementException } from "../hooks/useUpdateRequirementException";

interface RequirementExceptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  parentRequirementId?: string;
  initialData?: Partial<CreateRequirementExceptionDto> | Partial<UpdateRequirementExceptionDto>;
  mode?: "create" | "edit";
  exceptionId?: string;
}

export default function RequirementExceptionForm({
  isOpen,
  onClose,
  useCaseId,
  parentRequirementId,
  initialData,
  mode = "create",
  exceptionId,
}: RequirementExceptionFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const isEditMode = mode === "edit";

  const form = useForm<CreateRequirementExceptionDto | UpdateRequirementExceptionDto>({
    resolver: zodResolver(
      isEditMode ? updateRequirementExceptionSchema : createRequirementExceptionSchema,
    ),
    mode: "onSubmit",
    defaultValues: isEditMode
      ? { name: initialData?.name || "" }
      : { name: initialData?.name || "", requirementId: parentRequirementId },
  });

  const createException = useCreateRequirementException(useCaseId, {
    onSuccess: () => {
      form.reset();
      setServerError(null);
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Create exception failed";
      setServerError(msg);
    },
  });

  const updateException = useUpdateRequirementException(exceptionId ?? "", useCaseId, {
    onSuccess: () => {
      form.reset();
      setServerError(null);
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Update exception failed";
      setServerError(msg);
    },
  });

  const onSubmit = (values: CreateRequirementExceptionDto | UpdateRequirementExceptionDto) => {
    setServerError(null);
    if (isEditMode) {
      updateException.mutate(values as UpdateRequirementExceptionDto);
    } else {
      createException.mutate(values as CreateRequirementExceptionDto);
    }
  };

  const handleCancel = () => {
    form.reset();
    setServerError(null);
    onClose();
  };

  const isLoading =
    createException.isPending || updateException.isPending || form.formState.isSubmitting;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Exception" : "Add Exception"}
      className="max-w-lg"
    >
      {isLoading && (
        <Loading isOpen message={isEditMode ? "Updating exception..." : "Adding exception..."} />
      )}
      {serverError && <ErrorMessage message={serverError} />}
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...form.register("name")}
          label="Exception Name"
          placeholder="Describe the exception"
          error={form.formState.errors.name?.message}
          disabled={isLoading}
        />
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="px-6">
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
                ? "Update Exception"
                : "Add Exception"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
