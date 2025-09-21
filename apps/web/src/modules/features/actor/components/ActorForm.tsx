// components/ActorForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addActorSchema, AddActorDto, ActorSubtype } from "@repo/shared-schemas";
import { ApiFieldValidationError, isApiValidationError } from "@/services/api/api-errors";
import { useAddActor } from "../hooks/useAddActor";

type Props = {
  hideForm: () => void;
  projectId: string;
};

export default function ActorForm({ hideForm, projectId }: Props) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddActorDto>({
    resolver: zodResolver(addActorSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      subType: ActorSubtype.HUMAN,
      projectId,
    },
  });

  const createActor = useAddActor({
    onSuccess: () => {
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

      const msg = err?.response?.data?.message ?? err?.message ?? "Create actor failed";
      setServerError(msg);
    },
  });

  function onSubmit(values: AddActorDto) {
    setServerError(null);
    createActor.mutate(values);
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Add actor</h3>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={hideForm}
          aria-label="Close actor form"
        >
          ✕
        </button>
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
              placeholder="Actor name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>

          {/* Subtype */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtype</label>
            <select
              {...register("subType")}
              className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <>
                <option value="human">Human</option>
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="ai-agent">AI Agent</option>
                <option value="event">Event</option>
              </>
            </select>
            {errors.subType && (
              <p className="mt-1 text-sm text-red-700">{errors.subType.message}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              reset();
              hideForm();
            }}
            className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            disabled={createActor.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createActor.isPending}
            className="px-4 py-2 rounded-md bg-green-600 text-white text-sm disabled:opacity-60"
          >
            {createActor.isPending ? "Adding..." : "Add actor"}
          </button>
        </div>
      </form>
    </div>
  );
}
