import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProjectDto, createProjectSchema } from "@repo/shared-schemas";
import { useCreateProject } from "../hooks/useCreateProject";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";

type Props = { hideForm: () => void };

export default function ProjectForm({ hideForm }: Props) {
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
      hideForm();
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
    hideForm();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Create project</h3>

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
            <input
              {...register("name")}
              className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="E.g. Website redesign"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description", {
                // convert empty string (user left field blank) into undefined
                setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
              })}
              rows={4}
              className="w-full border rounded-md px-3 py-2 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Short description (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-700">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            disabled={createProject.isPending || isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createProject.isPending || isSubmitting}
            className="px-4 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-60"
          >
            {createProject.isPending || isSubmitting ? "Creating..." : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
