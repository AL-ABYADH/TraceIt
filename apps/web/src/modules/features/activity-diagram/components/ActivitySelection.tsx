"use client";

import Dialog from "@/components/Dialog";
import { useAllRequirementsUnderUseCase } from "../../requirement/hooks/useAllUseCaseRequirements";
import { RequirementListDto } from "@repo/shared-schemas";
import { ActivityShape } from "./ActivityShape";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";

interface ActivitySelectionProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  onActivitySelect: (requirement: RequirementListDto) => void;
}

export default function ActivitySelection({
  isOpen,
  onClose,
  useCaseId,
  onActivitySelect,
}: ActivitySelectionProps) {
  const {
    data: requirements,
    isError,
    isLoading,
    error,
  } = useAllRequirementsUnderUseCase(useCaseId, {
    enabled: isOpen && !!useCaseId,
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Select Activity" className="max-w-lg">
      {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}
      {isError && <ErrorMessage message={`Error loading requirements: ${error!.message}`} />}

      {requirements && requirements.length > 0 ? (
        <div className="flex flex-col item-center gap-3 p-1 max-h-96 overflow-y-auto">
          {requirements.map((requirement) => (
            <button
              key={requirement.id}
              onClick={() => {
                onActivitySelect(requirement);
                onClose();
              }}
              className="flex items-center justify-center p-2  hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ActivityShape
                // name={requirement.activityLabel || requirement.operation}
                name={requirement.operation || requirement.operation}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground text-center">
            <p>No requirements found for this use case.</p>
            <p className="text-sm mt-1">Create requirements first to add them as activities.</p>
          </div>
        </div>
      )}
    </Dialog>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Dialog from "@/components/Dialog";
// import { useAllRequirementsUnderUseCase } from "../../requirement/hooks/useAllUseCaseRequirements";
// import { RequirementListDto } from "@repo/shared-schemas";
// import { ActivityShape } from "./ActivityShape";
// import Loading from "@/components/Loading";
// import ErrorMessage from "@/components/ErrorMessage";

// interface ActivitySelectionProps {
//   isOpen: boolean;
//   onClose: () => void;
//   useCaseId: string;
//   onActivitySelect: (requirement: RequirementListDto) => void;
// }

// export default function ActivitySelection({
//   isOpen,
//   onClose,
//   useCaseId,
//   onActivitySelect,
// }: ActivitySelectionProps) {
//   const { data: requirements, isError, isLoading, error, refetch } = useAllRequirementsUnderUseCase(useCaseId, {
//     enabled: isOpen && !!useCaseId,
//   });

//   // Track locally resolved requirements for immediate visual feedback
//   const [resolvedRequirements, setResolvedRequirements] = useState<Set<string>>(new Set());

//   // Force refresh when dialog opens to get latest data
//   useEffect(() => {
//     if (isOpen) {
//       refetch();
//       // Clear resolved requirements when dialog opens to get fresh state
//       setResolvedRequirements(new Set());
//     }
//   }, [isOpen, refetch]);

//   // Process requirements to show immediate updates for resolved ones
//   const displayRequirements = requirements?.map(req => {
//     // If requirement was resolved locally, override the stale status
//     if (resolvedRequirements.has(req.id)) {
//       return {
//         ...req,
//         isActivityStale: false
//       };
//     }
//     return req;
//   }) || [];

//   const handleActivitySelect = (requirement: RequirementListDto) => {
//     // If the requirement was stale but is now resolved, mark it as resolved
//     if (requirement.isActivityStale && resolvedRequirements.has(requirement.id)) {
//       const updatedRequirement = {
//         ...requirement,
//         isActivityStale: false
//       };
//       onActivitySelect(updatedRequirement);
//     } else {
//       onActivitySelect(requirement);
//     }
//     onClose();
//   };

//   // Function to manually resolve a requirement's stale status
//   const handleResolveRequirement = (requirementId: string, e: React.MouseEvent) => {
//     e.stopPropagation(); // Prevent triggering the main click handler
//     setResolvedRequirements(prev => {
//       const newSet = new Set(prev);
//       newSet.add(requirementId);
//       return newSet;
//     });
//   };

//   return (
//     <Dialog isOpen={isOpen} onClose={onClose} title="Select Activity" className="max-w-lg">
//       {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}
//       {isError && <ErrorMessage message={`Error loading requirements: ${error!.message}`} />}

//       {displayRequirements && displayRequirements.length > 0 ? (
//         <div className="grid grid-cols-1 gap-3 p-1 max-h-96 overflow-y-auto">
//           {displayRequirements.map((requirement) => (
//             <div key={requirement.id} className="relative group">
//               <button
//                 onClick={() => handleActivitySelect(requirement)}
//                 className="flex items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full"
//               >
//                 <ActivityShape
//                   name={requirement.activityLabel || requirement.operation}
//                   isUpdated={requirement.isActivityStale && !resolvedRequirements.has(requirement.id)}
//                   style={{
//                     cursor: "pointer",
//                     transition: "all 0.2s ease",
//                   }}
//                 />
//               </button>

//               {/* Resolve button for stale requirements */}
//               {requirement.isActivityStale && !resolvedRequirements.has(requirement.id) && (
//                 <button
//                   onClick={(e) => handleResolveRequirement(requirement.id, e)}
//                   className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded-md shadow-sm"
//                   title="Mark as resolved"
//                 >
//                   Resolve
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex items-center justify-center py-8">
//           <div className="text-muted-foreground text-center">
//             <p>No requirements found for this use case.</p>
//             <p className="text-sm mt-1">Create requirements first to add them as activities.</p>
//           </div>
//         </div>
//       )}
//     </Dialog>
//   );
// }
