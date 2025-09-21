"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectDto, createProjectSchema } from "@repo/shared-schemas";
import { useCreateProject } from "../hooks/useCreateProject";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import InputField from "../../../../components/InputField";
import TextAreaField from "../../../../components/TextAreaField";
import Button from "../../../../components/Button";
import Dialog from "../../../../components/Dialog";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectForm({ isOpen, onClose }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    mode: "onSubmit",
    defaultValues: { name: "", description: "" },
  });

  const createProject = useCreateProject({
    onSuccess: (_data, _variables) => {
      reset();
      onClose();
    },
    onError: (err: any) => {
      setServerError(null);
      if (isApiValidationError(err)) {
        const serverErrors = (err as any).data.errors as ApiFieldValidationError[];
        serverErrors.forEach(({ field, message }) =>
          setError(field as any, { type: "server", message }),
        );
        return;
      }
      const msg = err?.response?.data?.message ?? err?.message ?? "Create project failed";
      setServerError(msg);
    },
  });

  const onSubmit = (values: CreateProjectDto) => {
    setServerError(null);
    createProject.mutate(values);
  };

  const handleCancel = () => {
    reset();
    setServerError(null);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Project" className="max-w-2xl">
      {serverError && (
        <div className="mb-6 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 p-4 rounded-xl">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <InputField
          {...register("name")}
          label="Project Name"
          placeholder="E.g. Website redesign"
          error={errors.name?.message}
        />

        <TextAreaField
          {...register("description", {
            setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
          })}
          label="Description"
          placeholder="Short description (optional)"
          rows={4}
          error={errors.description?.message}
        />

        <div className="flex items-center justify-end gap-3 pt-4 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createProject.isPending || isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={createProject.isPending || isSubmitting} className="px-8">
            {createProject.isPending || isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
