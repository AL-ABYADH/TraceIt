"use client";

import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { useActors } from "../../actor/hooks/useActors";
import {
  ActorDto,
  CreatePrimaryUseCaseDto,
  createPrimaryUseCaseSchema,
  UseCaseImportanceLevel,
} from "@repo/shared-schemas";
import { useCreatePrimaryUseCase } from "../hooks/useCreatePrimaryUseCase";

type Props = {
  hideForm?: () => void;
  projectId: string;
};

export default function UseCaseForm({ hideForm, projectId }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePrimaryUseCaseDto>({
    resolver: zodResolver(createPrimaryUseCaseSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      importanceLevel: UseCaseImportanceLevel.MEDIUM,
      primaryActorIds: [],
      secondaryActorIds: [],
      projectId,
    },
  });

  // watch the arrays so we can disable/check mutual exclusivity in the UI
  const primarySelected = useWatch({ control, name: "primaryActorIds" }) ?? [];
  const secondarySelected = useWatch({ control, name: "secondaryActorIds" }) ?? [];

  const createUseCase = useCreatePrimaryUseCase({
    onSuccess: () => {
      reset();
      setServerError(null);
      hideForm?.();
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

      const msg = err?.response?.data?.message ?? err?.message ?? "Create use case failed";
      setServerError(msg);
    },
  });

  const {
    data,
    isLoading: isActorsLoading,
    isError: isActorsError,
    error: actorsError,
  } = useActors(projectId);

  if (isActorsLoading) return <div>Loading...</div>;

  if (isActorsError) return <div>{actorsError.message}</div>;

  const actors = data!;

  const onSubmit = (values: CreatePrimaryUseCaseDto) => {
    setServerError(null);
    createUseCase.mutate(values);
  };

  // helper to toggle an id in an array
  const toggleId = (arr: string[] = [], id: string) =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Create use case</h3>
        {hideForm && (
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => hideForm()}
            aria-label="Close use case form"
          >
            ✕
          </button>
        )}
      </div>

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register("name")}
              className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Use case name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              {...register("description", {
                // convert empty string -> undefined so schema / server sees it as absent
                setValueAs: (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
              })}
              rows={4}
              className="w-full border rounded-md px-3 py-2 text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="A short description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-700">{errors.description.message}</p>
            )}
          </div>

          {/* Importance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Importance</label>
            <select
              {...register("importanceLevel")}
              className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            {errors.importanceLevel && (
              <p className="mt-1 text-sm text-red-700">{errors.importanceLevel.message}</p>
            )}
          </div>

          {/* Actors selection: two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Primary actors</label>
                <span className="text-xs text-gray-500">
                  {isActorsLoading ? "Loading…" : `${actors.length} available`}
                </span>
              </div>

              <Controller
                control={control}
                name="primaryActorIds"
                render={({ field }) => (
                  <div className="max-h-48 overflow-auto border rounded p-2 bg-gray-50">
                    {actors.length === 0 ? (
                      <div className="text-sm text-gray-500">No actors available</div>
                    ) : (
                      actors.map((a: ActorDto) => {
                        const checked = (field.value || []).includes(a.id);
                        const isInSecondary = (secondarySelected || []).includes(a.id);
                        return (
                          <label
                            key={a.id}
                            className={`flex items-center space-x-2 py-1 text-sm ${
                              isInSecondary ? "opacity-70" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isInSecondary || createUseCase.isPending}
                              onChange={() => {
                                // toggle in primary
                                const newPrimary = toggleId(field.value || [], a.id);
                                // ensure it's removed from secondary
                                const newSecondary = (secondarySelected || []).filter(
                                  (id) => id !== a.id,
                                );
                                setValue("primaryActorIds", newPrimary, { shouldValidate: true });
                                setValue("secondaryActorIds", newSecondary, {
                                  shouldValidate: true,
                                });
                              }}
                              className="h-4 w-4 border-gray-300 rounded text-green-600"
                            />
                            <span className="text-gray-700">{a.name}</span>
                            <span className="text-xs text-gray-700 ml-2">({a.subtype})</span>
                            {isInSecondary && (
                              <span className="text-xs text-red-500 ml-2">
                                selected as secondary
                              </span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              />
              {errors.primaryActorIds && (
                <p className="mt-1 text-sm text-red-700">{errors.primaryActorIds.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Secondary actors</label>
                <span className="text-xs text-gray-500">
                  {isActorsLoading ? "Loading…" : `${actors.length} available`}
                </span>
              </div>

              <Controller
                control={control}
                name="secondaryActorIds"
                render={({ field }) => (
                  <div className="max-h-48 overflow-auto border rounded p-2 bg-gray-50">
                    {actors.length === 0 ? (
                      <div className="text-sm text-gray-500">No actors available</div>
                    ) : (
                      actors.map((a: ActorDto) => {
                        const checked = (field.value || []).includes(a.id);
                        const isInPrimary = (primarySelected || []).includes(a.id);
                        return (
                          <label
                            key={a.id}
                            className={`flex items-center space-x-2 py-1 text-sm ${
                              isInPrimary ? "opacity-70" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={isInPrimary || createUseCase.isPending}
                              onChange={() => {
                                // toggle in secondary
                                const newSecondary = toggleId(field.value || [], a.id);
                                // ensure it's removed from primary
                                const newPrimary = (primarySelected || []).filter(
                                  (id) => id !== a.id,
                                );
                                setValue("secondaryActorIds", newSecondary, {
                                  shouldValidate: true,
                                });
                                setValue("primaryActorIds", newPrimary, { shouldValidate: true });
                              }}
                              className="h-4 w-4 border-gray-300 rounded text-green-600"
                            />
                            <span className="text-gray-700">{a.name}</span>
                            <span className="text-xs text-gray-700 ml-2">({a.subtype})</span>
                            {isInPrimary && (
                              <span className="text-xs text-red-500 ml-2">selected as primary</span>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              />
              {errors.secondaryActorIds && (
                <p className="mt-1 text-sm text-red-700">{errors.secondaryActorIds.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setServerError(null);
              hideForm?.();
            }}
            className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            disabled={createUseCase.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createUseCase.isPending}
            className="px-4 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-60"
          >
            {createUseCase.isPending ? "Creating..." : "Create use case"}
          </button>
        </div>
      </form>
    </div>
  );
}
