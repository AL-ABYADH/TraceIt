"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  updateProjectSchema,
  CreateProjectDto,
  UpdateProjectDto,
} from "@repo/shared-schemas";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

type Mode = "create" | "update";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: Mode;
  initialData?: Partial<CreateProjectDto>;
  onSubmitCreate?: (data: CreateProjectDto) => void;
  onSubmitUpdate?: (data: UpdateProjectDto) => void;
  isPending?: boolean;
}

export default function ProjectForm({
  isOpen,
  onClose,
  mode = "create",
  initialData,
  onSubmitCreate,
  onSubmitUpdate,
  isPending = false,
}: ProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const isUpdate = mode === "update";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectDto | UpdateProjectDto>({
    resolver: zodResolver(isUpdate ? updateProjectSchema : createProjectSchema),
    mode: "onSubmit",
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
      });
    }
  }, [isOpen, initialData, reset]);

  const submitHandler = (values: any) => {
    setServerError(null);
    if (isUpdate && onSubmitUpdate) {
      onSubmitUpdate(values as UpdateProjectDto);
    } else if (!isUpdate && onSubmitCreate) {
      onSubmitCreate(values as CreateProjectDto);
    }
  };

  const handleCancel = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Update Project" : "Create Project"}
      className="max-w-2xl"
    >
      {(isPending || isSubmitting) && (
        <Loading
          isOpen={isPending || isSubmitting}
          message={isUpdate ? "Updating project..." : "Creating project..."}
        />
      )}

      {serverError && <ErrorMessage message={serverError} />}

      <form onSubmit={handleSubmit(submitHandler)} noValidate className="space-y-6">
        <InputField
          {...register("name")}
          label="Project Name"
          placeholder="E.g. Website redesign"
          error={errors.name?.message}
          disabled={isPending || isSubmitting}
        />

        <TextAreaField
          {...register("description", {
            setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
          })}
          label="Description"
          placeholder="Short description (optional)"
          rows={4}
          error={errors.description?.message}
          disabled={isPending || isSubmitting}
        />

        <div className="flex items-center justify-end gap-3 pt-4 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isPending || isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending || isSubmitting} className="px-8">
            {isPending || isSubmitting
              ? isUpdate
                ? "Updating..."
                : "Creating..."
              : isUpdate
                ? "Update"
                : "Create"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
