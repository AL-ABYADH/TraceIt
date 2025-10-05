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
} from "@repo/shared-schemas";

interface RequirementExceptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  parentRequirementId: string;
  initialData?: Partial<CreateRequirementExceptionDto>;
}

export default function RequirementExceptionForm({
  isOpen,
  onClose,
  useCaseId,
  parentRequirementId,
  initialData,
}: RequirementExceptionFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequirementExceptionDto>({
    resolver: zodResolver(createRequirementExceptionSchema),
    mode: "onSubmit",
    defaultValues: {
      name: initialData?.name || "",
      requirementId: parentRequirementId,
    },
  });

  const createException = useCreateRequirementException(useCaseId, {
    onSuccess: () => {
      reset();
      setServerError(null);
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Create exception failed";
      setServerError(msg);
    },
  });

  const onSubmit = (values: CreateRequirementExceptionDto) => {
    setServerError(null);
    createException.mutate(values);
  };

  const handleCancel = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Add Exception" className="max-w-lg">
      {(createException.isPending || isSubmitting) && (
        <Loading isOpen message="Adding exception..." />
      )}
      {serverError && <ErrorMessage message={serverError} />}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("name")}
          label="Exception Name"
          placeholder="Describe the exception"
          error={errors.name?.message}
          disabled={createException.isPending || isSubmitting}
        />
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createException.isPending || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createException.isPending || isSubmitting}
            className="px-6"
          >
            {createException.isPending || isSubmitting ? "Adding..." : "Add Exception"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
