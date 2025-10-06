// // // // // "use client";

// // // // // import Dialog from "@/components/Dialog";
// // // // // import Loading from "@/components/Loading";
// // // // // import ErrorMessage from "@/components/ErrorMessage";
// // // // // import { RequirementDto } from "@repo/shared-schemas";
// // // // // import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";

// // // // // interface RequirementSelectionProps {
// // // // //   isOpen: boolean;
// // // // //   onClose: () => void;
// // // // //   useCaseId: string;
// // // // //   showOnlyWithCondition?: boolean;
// // // // //   onRequirementSelect: (requirement: RequirementDto) => void;
// // // // // }

// // // // // export default function RequirementSelection({
// // // // //   isOpen,
// // // // //   onClose,
// // // // //   useCaseId,
// // // // //   showOnlyWithCondition = false,
// // // // //   onRequirementSelect,
// // // // // }: RequirementSelectionProps) {
// // // // //   const { data: requirements, isError, isLoading, error } = useUseCasesRequirements(useCaseId);

// // // // //   // Debug logging
// // // // //   console.log('🔍 RequirementSelection Filtering:', {
// // // // //     showOnlyWithCondition,
// // // // //     totalRequirements: requirements?.length,
// // // // //     requirements: requirements?.map(r => ({
// // // // //       id: r.id,
// // // // //       operation: r.operation,
// // // // //       condition: r.condition,
// // // // //       hasCondition: !!r.condition,
// // // // //       isNonEmptyCondition: r.condition && r.condition.trim().length > 0
// // // // //     }))
// // // // //   });

// // // // //   // Simple and clear filtering
// // // // //   const filteredRequirements = showOnlyWithCondition
// // // // //     ? requirements?.filter(req => req.condition && req.condition.trim().length > 0)
// // // // //     : requirements;

// // // // //   console.log('🔍 Filtered results:', {
// // // // //     filteredCount: filteredRequirements?.length,
// // // // //     filteredRequirements: filteredRequirements?.map(r => r.operation)
// // // // //   });

// // // // //   const title = showOnlyWithCondition
// // // // //     ? "Select Requirement with Condition"
// // // // //     : "Select Requirement";

// // // // //   const emptyMessage = showOnlyWithCondition
// // // // //     ? "No requirements with conditions found for this use case."
// // // // //     : "No requirements found for this use case.";

// // // // //   return (
// // // // //     <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
// // // // //       {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}
// // // // //       {isError && <ErrorMessage message={`Error loading requirements: ${error!.message}`} />}

// // // // //       {filteredRequirements && filteredRequirements.length > 0 ? (
// // // // //         <div className="space-y-2 max-h-96 overflow-y-auto p-1">
// // // // //           {filteredRequirements.map((requirement) => (
// // // // //             <button
// // // // //               key={requirement.id}
// // // // //               onClick={() => onRequirementSelect(requirement)}
// // // // //               className="w-full text-left p-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //             >
// // // // //               <div className="font-medium">{requirement.operation}</div>
// // // // //               {requirement.condition && (
// // // // //                 <div className="text-sm text-muted-foreground mt-1">
// // // // //                   Condition: {requirement.condition}
// // // // //                 </div>
// // // // //               )}
// // // // //             </button>
// // // // //           ))}
// // // // //         </div>
// // // // //       ) : (
// // // // //         <div className="text-center py-8 text-muted-foreground">
// // // // //           {emptyMessage}
// // // // //         </div>
// // // // //       )}
// // // // //     </Dialog>
// // // // //   );
// // // // // }

// // // // "use client";

// // // // import Dialog from "@/components/Dialog";
// // // // import Loading from "@/components/Loading";
// // // // import ErrorMessage from "@/components/ErrorMessage";
// // // // import { RequirementDto } from "@repo/shared-schemas";
// // // // import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";

// // // // interface RequirementSelectionProps {
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // //   useCaseId: string;
// // // //   showOnlyWithCondition?: boolean;
// // // //   onRequirementSelect: (requirement: RequirementDto) => void;
// // // //   availableRequirements?: RequirementDto[];
// // // //   usedRequirementIds?: string[];
// // // // }

// // // // export default function RequirementSelection({
// // // //   isOpen,
// // // //   onClose,
// // // //   useCaseId,
// // // //   showOnlyWithCondition = false,
// // // //   onRequirementSelect,
// // // //   availableRequirements,
// // // //   usedRequirementIds,
// // // // }: RequirementSelectionProps) {
// // // //   const { data: allRequirements, isError, isLoading, error } = useUseCasesRequirements(useCaseId);

// // // //   // Use provided availableRequirements or fall back to all requirements
// // // //   const requirementsToShow = availableRequirements || allRequirements;

// // // //   // Simple and clear filtering
// // // //   const filteredRequirements = showOnlyWithCondition
// // // //     ? requirementsToShow?.filter(req => req.condition && req.condition.trim().length > 0)
// // // //     : requirementsToShow;

// // // //   console.log('🔍 RequirementSelection Filtering:', {
// // // //     showOnlyWithCondition,
// // // //     totalRequirements: allRequirements?.length,
// // // //     availableRequirements: availableRequirements?.length,
// // // //     usedRequirementIds: usedRequirementIds?.length,
// // // //     filteredCount: filteredRequirements?.length
// // // //   });

// // // //   const title = showOnlyWithCondition
// // // //     ? "Select Requirement with Condition"
// // // //     : "Select Requirement";

// // // //   const emptyMessage = showOnlyWithCondition
// // // //     ? "No requirements with conditions found for this use case."
// // // //     : "No available requirements found for this use case.";

// // // //   return (
// // // //     <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
// // // //       {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}
// // // //       {isError && <ErrorMessage message={`Error loading requirements: ${error!.message}`} />}

// // // //       {filteredRequirements && filteredRequirements.length > 0 ? (
// // // //         <div className="space-y-2 max-h-96 overflow-y-auto p-1">
// // // //           {filteredRequirements.map((requirement) => (
// // // //             <button
// // // //               key={requirement.id}
// // // //               onClick={() => onRequirementSelect(requirement)}
// // // //               className="w-full text-left p-3 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
// // // //             >
// // // //               <div className="font-medium">{requirement.operation}</div>
// // // //               {requirement.condition && (
// // // //                 <div className="text-sm text-muted-foreground mt-1">
// // // //                   Condition: {requirement.condition}
// // // //                 </div>
// // // //               )}
// // // //               {usedRequirementIds?.includes(requirement.id) && (
// // // //                 <div className="text-xs text-yellow-600 mt-1">
// // // //                   ⚠️ Already has connected activity/condition
// // // //                 </div>
// // // //               )}
// // // //             </button>
// // // //           ))}
// // // //         </div>
// // // //       ) : (
// // // //         <div className="text-center py-8 text-muted-foreground">
// // // //           {emptyMessage}
// // // //           {usedRequirementIds && usedRequirementIds.length > 0 && (
// // // //             <div className="mt-2 text-sm">
// // // //               {allRequirements?.length || 0} total requirements, {usedRequirementIds.length} already used
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       )}
// // // //     </Dialog>
// // // //   );
// // // // }

// // // "use client";

// // // import Dialog from "@/components/Dialog";
// // // import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
// // // import Loading from "@/components/Loading";
// // // import ErrorMessage from "@/components/ErrorMessage";
// // // import { X, Check, Ban, Lock } from "lucide-react";
// // // import { useActivities } from "../hooks/useActivities";
// // // import { useUseCaseConditions } from "../hooks/useUseCaseConditions";

// // // interface RequirementSelectionProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   useCaseId: string;
// // //   showOnlyWithCondition?: boolean;
// // //   onRequirementSelect: (requirement: any) => void;
// // // }

// // // // Simple requirement shape component
// // // const RequirementShape = ({ name, style, className }: { name: string; style?: React.CSSProperties; className?: string }) => (
// // //   <div
// // //     style={style}
// // //     className={`bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 text-blue-800 font-medium ${className || ''}`}
// // //   >
// // //     {name}
// // //   </div>
// // // );

// // // export default function RequirementSelection({
// // //   isOpen,
// // //   onClose,
// // //   useCaseId,
// // //   showOnlyWithCondition = false,
// // //   onRequirementSelect,
// // // }: RequirementSelectionProps) {
// // //   const { data: requirements, isError, isLoading, error } = useUseCasesRequirements(useCaseId);
// // //   const { data: activities } = useActivities(useCaseId);
// // //   const { data: conditions } = useUseCaseConditions(useCaseId);

// // //   console.log('🔍 RequirementSelection Debug:', {
// // //     requirements: requirements?.length,
// // //     activities: activities?.length,
// // //     conditions: conditions?.length,
// // //     activityData: activities?.map(a => ({ id: a.id, name: a.name, requirementId: (a as any).requirementId })),
// // //     conditionData: conditions?.map(c => ({ id: c.id, name: c.name, requirementId: (c as any).requirementId }))
// // //   });

// // //   // Get requirement IDs that already have activities
// // //   const getRequirementsWithActivities = () => {
// // //     const requirementIds = new Set<string>();

// // //     activities?.forEach(activity => {
// // //       const requirementId = (activity as any).requirementId;
// // //       if (requirementId) {
// // //         requirementIds.add(requirementId);
// // //       }
// // //     });

// // //     return requirementIds;
// // //   };

// // //   // Get requirement IDs that already have conditions
// // //   const getRequirementsWithConditions = () => {
// // //     const requirementIds = new Set<string>();

// // //     conditions?.forEach(condition => {
// // //       const requirementId = (condition as any).requirementId;
// // //       if (requirementId) {
// // //         requirementIds.add(requirementId);
// // //       }
// // //     });

// // //     return requirementIds;
// // //   };

// // //   // Filter and get status for requirements
// // //   const getProcessedRequirements = () => {
// // //     if (!requirements) return [];

// // //     const requirementsWithActivities = getRequirementsWithActivities();
// // //     const requirementsWithConditions = getRequirementsWithConditions();

// // //     return requirements
// // //       .filter(requirement => {
// // //         if (showOnlyWithCondition) {
// // //           // For condition creation: ONLY show requirements that HAVE conditions defined
// // //           return requirement.condition && requirement.condition.trim() !== '';
// // //         } else {
// // //           // For activity creation: show all requirements
// // //           return true;
// // //         }
// // //       })
// // //       .map(requirement => {
// // //         const hasActivity = requirementsWithActivities.has(requirement.id);
// // //         const hasCondition = requirementsWithConditions.has(requirement.id);

// // //         let disabled = false;
// // //         let status: 'available' | 'has-activity' | 'has-condition' = 'available';
// // //         let tooltip = 'Available for selection';

// // //         if (showOnlyWithCondition) {
// // //           // For condition creation: disable if already has condition relationship
// // //           disabled = hasCondition;
// // //           status = hasCondition ? 'has-condition' : 'available';
// // //           tooltip = hasCondition
// // //             ? 'This requirement already has a condition relationship'
// // //             : 'Available for condition creation';
// // //         } else {
// // //           // For activity creation: disable if already has activity
// // //           disabled = hasActivity;
// // //           status = hasActivity ? 'has-activity' : 'available';
// // //           tooltip = hasActivity ? 'This requirement already has an activity' : 'Available for activity creation';
// // //         }

// // //         return {
// // //           ...requirement,
// // //           disabled,
// // //           status,
// // //           tooltip
// // //         };
// // //       });
// // //   };

// // //   const processedRequirements = getProcessedRequirements();
// // //   const availableRequirements = processedRequirements.filter(req => !req.disabled);

// // //   // const handleRequirementClick = (requirement: any) => {
// // //   //   if (requirement.disabled) {
// // //   //     return; // Do nothing if disabled
// // //   //   }
// // //   //   onRequirementSelect(requirement);
// // //   //   onClose();
// // //   // };

// // //   const handleRequirementClick = (requirement: any) => {
// // //   if (requirement.disabled) {
// // //     console.log('🚫 Requirement disabled, not proceeding:', requirement.operation);
// // //     return; // Do nothing if disabled
// // //   }
// // //   console.log('✅ Requirement available, proceeding:', requirement.operation);
// // //   onRequirementSelect(requirement); // This passes the entire requirement object including disabled status
// // //   onClose();
// // // };
// // //   return (
// // //     <Dialog
// // //       isOpen={isOpen}
// // //       onClose={onClose}
// // //       title=""
// // //       className="max-w-lg p-0 overflow-hidden"
// // //     >
// // //       {/* Header */}
// // //       <div className="flex items-center justify-between p-6 pb-4 border-b">
// // //         <div>
// // //           <h2 className="text-lg font-semibold text-foreground">
// // //             {showOnlyWithCondition ? "Select Requirement for Condition" : "Select Requirement for Activity"}
// // //           </h2>
// // //           <p className="text-sm text-muted-foreground mt-1">
// // //             {showOnlyWithCondition
// // //               ? "Requirements with conditional logic"
// // //               : "Choose a requirement to create an activity"}
// // //           </p>
// // //         </div>
// // //         <button
// // //           onClick={onClose}
// // //           className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
// // //         >
// // //           <X className="h-4 w-4" />
// // //         </button>
// // //       </div>

// // //       {/* Content */}
// // //       <div className="p-6">
// // //         {isLoading && (
// // //           <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />
// // //         )}
// // //         {isError && <ErrorMessage message={`Error loading requirements: ${error!.message}`} />}

// // //         {!isLoading && !isError && (
// // //           <>
// // //             {/* Summary */}
// // //             <div className="mb-4 p-3 bg-muted rounded-lg">
// // //               <div className="flex justify-between items-center text-sm">
// // //                 <span className="text-muted-foreground">
// // //                   {showOnlyWithCondition
// // //                     ? `${availableRequirements.length} available for condition creation`
// // //                     : `${availableRequirements.length} of ${processedRequirements.length} requirements available`
// // //                   }
// // //                 </span>
// // //                 <span className={`px-2 py-1 rounded-full text-xs ${
// // //                   availableRequirements.length > 0
// // //                     ? 'bg-green-100 text-green-800'
// // //                     : 'bg-yellow-100 text-yellow-800'
// // //                 }`}>
// // //                   {availableRequirements.length > 0 ? 'Available' : 'All used'}
// // //                 </span>
// // //               </div>
// // //             </div>

// // //             {/* Requirements List */}
// // //             <div className="space-y-3 max-h-96 overflow-y-auto">
// // //               {processedRequirements.map((requirement) => (
// // //                 <div
// // //                   key={requirement.id}
// // //                   className={`relative p-4 border rounded-xl transition-all duration-200 ${
// // //                     requirement.disabled
// // //                       ? "border-gray-200 bg-gray-50 cursor-not-allowed select-none"
// // //                       : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-sm"
// // //                   }`}
// // //                   onClick={() => handleRequirementClick(requirement)}
// // //                   title={requirement.tooltip}
// // //                 >
// // //                   {/* Requirement Content */}
// // //                   <div className="flex items-center justify-between">
// // //                     <div className="flex items-center space-x-3 flex-1">
// // //                       {/* Status Icon */}
// // //                       <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
// // //                         requirement.disabled ? 'bg-gray-200' : 'bg-blue-100'
// // //                       }`}>
// // //                         {requirement.disabled ? (
// // //                           <Lock className="h-4 w-4 text-gray-500" />
// // //                         ) : (
// // //                           <Check className="h-4 w-4 text-blue-600" />
// // //                         )}
// // //                       </div>

// // //                       {/* Requirement Info */}
// // //                       <div className="flex-1 min-w-0">
// // //                         <div className="flex items-center space-x-2">
// // //                           <span className={`font-medium truncate ${
// // //                             requirement.disabled ? 'text-gray-500' : 'text-foreground'
// // //                           }`}>
// // //                             {requirement.operation}
// // //                           </span>
// // //                         </div>
// // //                         {requirement.condition && (
// // //                           <p className="text-sm text-muted-foreground mt-1 truncate">
// // //                             Condition: {requirement.condition}
// // //                           </p>
// // //                         )}
// // //                       </div>
// // //                     </div>

// // //                     {/* Status Badge */}
// // //                     <div className="flex-shrink-0 ml-3">
// // //                       <span className={`text-xs px-2 py-1 rounded-full ${
// // //                         requirement.status === 'has-activity'
// // //                           ? 'bg-red-100 text-red-800 border border-red-200'
// // //                           : requirement.status === 'has-condition'
// // //                           ? 'bg-orange-100 text-orange-800 border border-orange-200'
// // //                           : 'bg-green-100 text-green-800 border border-green-200'
// // //                       }`}>
// // //                         {requirement.status === 'has-activity'
// // //                           ? 'Has Activity'
// // //                           : requirement.status === 'has-condition'
// // //                           ? 'Has Condition'
// // //                           : 'Available'}
// // //                       </span>
// // //                     </div>
// // //                   </div>

// // //                   {/* Disabled Overlay - This prevents clicks */}
// // //                   {requirement.disabled && (
// // //                     <div
// // //                       className="absolute inset-0 bg-white/80 rounded-xl cursor-not-allowed"
// // //                       onClick={(e) => e.stopPropagation()} // Prevent any clicks
// // //                     />
// // //                   )}
// // //                 </div>
// // //               ))}
// // //             </div>

// // //             {/* Empty State */}
// // //             {processedRequirements.length === 0 && !isLoading && (
// // //               <div className="flex flex-col items-center justify-center py-8 text-center">
// // //                 <div className="w-12 h-12 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center mb-3">
// // //                   <X className="h-6 w-6 text-muted-foreground/50" />
// // //                 </div>
// // //                 <p className="text-muted-foreground">
// // //                   {showOnlyWithCondition
// // //                     ? "No requirements with conditions found"
// // //                     : "No requirements found"
// // //                   }
// // //                 </p>
// // //                 <p className="text-sm text-muted-foreground mt-1">
// // //                   {showOnlyWithCondition
// // //                     ? "Add conditional logic to requirements first"
// // //                     : "Create requirements first to see them here"
// // //                   }
// // //                 </p>
// // //               </div>
// // //             )}

// // //             {availableRequirements.length === 0 && processedRequirements.length > 0 && (
// // //               <div className="flex flex-col items-center justify-center py-8 text-center border-t mt-4">
// // //                 <div className="w-12 h-12 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center mb-3">
// // //                   <Ban className="h-6 w-6 text-muted-foreground/50" />
// // //                 </div>
// // //                 <p className="text-muted-foreground font-medium">All requirements are already associated</p>
// // //                 <p className="text-sm text-muted-foreground mt-1">
// // //                   {showOnlyWithCondition
// // //                     ? "All requirements with conditions already have condition relationships"
// // //                     : "All requirements already have activities associated"}
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </>
// // //         )}
// // //       </div>
// // //     </Dialog>
// // //   );
// // // }

// // "use client";
// // import Dialog from "@/components/Dialog";
// // import Loading from "@/components/Loading";
// // import ErrorMessage from "@/components/ErrorMessage";
// // import { RequirementDto } from "@repo/shared-schemas";
// // import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";

// // interface RequirementSelectionProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   useCaseId: string;
// //   isConditionMode?: boolean; // true when selecting requirement for creating a CONDITION
// //   onRequirementSelect: (requirement: RequirementDto) => void;
// //   availableRequirements?: RequirementDto[];
// //   usedActivityRequirementIds?: string[]; // IDs already linked to an Activity
// //   usedConditionRequirementIds?: string[]; // IDs already linked to a Condition/Decision
// // }

// // export default function RequirementSelection({
// //   isOpen,
// //   onClose,
// //   useCaseId,
// //   isConditionMode = false,
// //   onRequirementSelect,
// //   availableRequirements,
// //   usedActivityRequirementIds = [],
// //   usedConditionRequirementIds = [],
// // }: RequirementSelectionProps) {
// //   const { data: allRequirements, isError, isLoading, error } = useUseCasesRequirements(useCaseId);

// //   // Use provided availableRequirements or fall back to all requirements
// //   const requirementsToShow = availableRequirements || allRequirements || [];

// //   // Filtering rules:
// //   // - Condition mode: only show requirements that HAVE a condition string (requirement.condition) — and disable ones that already have a condition relationship.
// //   // - Activity mode: show all requirements — but disable ones that already have an activity relationship.
// //   const filteredRequirements = isConditionMode
// //     ? requirementsToShow.filter((req) => req.condition && req.condition.trim().length > 0)
// //     : requirementsToShow;

// //   console.log('🔍 RequirementSelection Filtering:', {
// //     isConditionMode,
// //     totalRequirements: allRequirements?.length ?? 0,
// //     filteredCount: filteredRequirements?.length ?? 0,
// //     usedActivityCount: usedActivityRequirementIds?.length ?? 0,
// //     usedConditionCount: usedConditionRequirementIds?.length ?? 0,
// //   });

// //   const title = isConditionMode ? "Select Requirement for Condition" : "Select Requirement for Activity";

// //   const emptyMessage = isConditionMode
// //     ? "No requirements with condition templates found for this use case."
// //     : "No available requirements found for this use case.";

// //   return (
// //     <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
// //       {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}
// //       {isError && <ErrorMessage message={`Error loading requirements: ${(error as any)?.message ?? "Unknown error"}`} />}

// //       {filteredRequirements && filteredRequirements.length > 0 ? (
// //         <div className="space-y-2 max-h-96 overflow-y-auto p-1">
// //           {filteredRequirements.map((requirement) => {
// //             // Determine "used" status depending on mode
// //             const isUsedByActivity = usedActivityRequirementIds?.includes(requirement.id);
// //             const isUsedByCondition = usedConditionRequirementIds?.includes(requirement.id);

// //             // In condition mode, a requirement is "used" if it already has a condition relationship.
// //             // In activity mode, a requirement is "used" if it already has an activity relationship.
// //             const isDisabled = isConditionMode ? isUsedByCondition : isUsedByActivity;

// //             // For clarity display both statuses (activity/condition) if present
// //             const statusBadges: string[] = [];
// //             if (isUsedByActivity) statusBadges.push("activity");
// //             if (isUsedByCondition) statusBadges.push("condition");

// //             return (
// //               <button
// //                 key={requirement.id}
// //                 onClick={() => {
// //                   // defensive: do not call if disabled
// //                   if (isDisabled) return;
// //                   onRequirementSelect(requirement);
// //                 }}
// //                 disabled={isDisabled}
// //                 className={
// //                   `w-full text-left p-3 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary
// //                    ${isDisabled ? "opacity-60 cursor-not-allowed bg-muted" : "hover:bg-accent hover:text-accent-foreground"}`
// //                 }
// //               >
// //                 <div className="flex items-center justify-between">
// //                   <div className="font-medium">{requirement.operation}</div>
// //                   {statusBadges.length > 0 && (
// //                     <div className="text-xs text-muted-foreground ml-2">
// //                       {statusBadges.join(", ")}
// //                     </div>
// //                   )}
// //                 </div>

// //                 {requirement.condition && (
// //                   <div className="text-sm text-muted-foreground mt-1">
// //                     Condition: {requirement.condition}
// //                   </div>
// //                 )}

// //                 {isDisabled && (
// //                   <div className="text-xs text-yellow-600 mt-1">
// //                     ⚠️ Already has linked {isConditionMode ? "condition" : "activity"}
// //                   </div>
// //                 )}
// //               </button>
// //             );
// //           })}
// //         </div>
// //       ) : (
// //         <div className="text-center py-8 text-muted-foreground">
// //           {emptyMessage}
// //           <div className="mt-2 text-sm">
// //             {allRequirements?.length ?? 0} total requirements.
// //             {usedActivityRequirementIds && usedActivityRequirementIds.length > 0 && (
// //               <div>{usedActivityRequirementIds.length} requirements already linked to activities.</div>
// //             )}
// //             {usedConditionRequirementIds && usedConditionRequirementIds.length > 0 && (
// //               <div>{usedConditionRequirementIds.length} requirements already linked to conditions.</div>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </Dialog>
// //   );
// // }

// "use client";
// import { useEffect, useMemo, useState } from "react";
// import Dialog from "@/components/Dialog";
// import Loading from "@/components/Loading";
// import ErrorMessage from "@/components/ErrorMessage";
// import { RequirementDto } from "@repo/shared-schemas";
// import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
// import { requirementClient } from "../../requirement/api/clients/requirement-client";

// interface RequirementSelectionProps {
//   isOpen: boolean;
//   onClose: () => void;
//   useCaseId: string;
//   isConditionMode?: boolean; // true when selecting requirement for creating a CONDITION
//   onRequirementSelect: (requirement: RequirementDto) => void;
//   availableRequirements?: RequirementDto[];
// }

// type RelationStatus = { hasActivity: boolean; hasCondition: boolean };

// export default function RequirementSelection({
//   isOpen,
//   onClose,
//   useCaseId,
//   isConditionMode = false,
//   onRequirementSelect,
//   availableRequirements,
// }: RequirementSelectionProps) {
//   const { data: allRequirements, isError, isLoading, error } = useUseCasesRequirements(useCaseId);

//   // Use provided availableRequirements or fall back to all requirements
//   const requirementsToShow = availableRequirements || allRequirements || [];

//   // Filtering rules:
//   // - Condition mode: only show requirements that HAVE a condition string (requirement.condition)
//   // - Activity mode: show all requirements
//   const filteredRequirements = useMemo(
//     () => (isConditionMode ? requirementsToShow.filter((req) => req.condition && req.condition.trim().length > 0) : requirementsToShow),
//     [isConditionMode, requirementsToShow]
//   );

//   // relationship statuses fetched from the server: { [requirementId]: RelationStatus }
//   const [statuses, setStatuses] = useState<Record<string, RelationStatus>>({});
//   const [isStatusesLoading, setIsStatusesLoading] = useState(false);

//   useEffect(() => {
//     if (!isOpen) return;

//     // If there are no requirements to check, clear statuses and exit early
//     if (!filteredRequirements || filteredRequirements.length === 0) {
//       setStatuses({});
//       return;
//     }

//     let mounted = true;
//     setIsStatusesLoading(true);

//     // Fetch relationship status for each requirement (uses existing single endpoint)
//     Promise.all(
//       filteredRequirements.map((req) =>
//         requirementClient
//           .getRequirementRelationships({ requirementId: req.id })
//           .then((res) => ({ id: req.id, status: res }))
//           .catch((err) => {
//             // If a single check fails, we still continue — default to false/false for that item.
//             console.error(`Failed to fetch relationships for requirement ${req.id}`, err);
//             return { id: req.id, status: { hasActivity: false, hasCondition: false } };
//           })
//       )
//     )
//       .then((results) => {
//         if (!mounted) return;
//         const map: Record<string, RelationStatus> = {};
//         for (const r of results) map[r.id] = r.status;
//         setStatuses(map);
//       })
//       .finally(() => {
//         if (!mounted) return;
//         setIsStatusesLoading(false);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, [isOpen, filteredRequirements]);

//   console.log("🔍 RequirementSelection Filtering:", {
//     isConditionMode,
//     totalRequirements: allRequirements?.length ?? 0,
//     filteredCount: filteredRequirements?.length ?? 0,
//     statusesLoaded: Object.keys(statuses).length,
//     isStatusesLoading,
//   });

//   const title = isConditionMode ? "Select Requirement for Condition" : "Select Requirement for Activity";

//   const emptyMessage = isConditionMode
//     ? "No requirements with condition templates found for this use case."
//     : "No available requirements found for this use case.";

//   return (
//     <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
//       {/* Loading requirements list */}
//       {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}

//       {/* Loading relationship checks */}
//       {!isLoading && isStatusesLoading && (
//         <div className="p-2 text-sm text-muted-foreground">Checking requirement relationships...</div>
//       )}

//       {isError && <ErrorMessage message={`Error loading requirements: ${(error as any)?.message ?? "Unknown error"}`} />}

//       {filteredRequirements && filteredRequirements.length > 0 ? (
//         <div className="space-y-2 max-h-96 overflow-y-auto p-1">
//           {filteredRequirements.map((requirement) => {
//             const status = statuses[requirement.id] ?? { hasActivity: false, hasCondition: false };

//             // Determine "used" status depending on mode
//             const isUsedByActivity = Boolean(status.hasActivity);
//             const isUsedByCondition = Boolean(status.hasCondition);

//             // In condition mode, a requirement is "used" if it already has a condition relationship.
//             // In activity mode, a requirement is "used" if it already has an activity relationship.
//             const isDisabled = isConditionMode ? isUsedByCondition : isUsedByActivity;

//             // For clarity display both statuses (activity/condition) if present
//             const statusBadges: string[] = [];
//             if (isUsedByActivity) statusBadges.push("activity");
//             if (isUsedByCondition) statusBadges.push("condition");

//             return (
//               <button
//                 key={requirement.id}
//                 onClick={() => {
//                   // defensive: do not call if disabled
//                   if (isDisabled) return;
//                   onRequirementSelect(requirement);
//                 }}
//                 disabled={isDisabled}
//                 className={
//                   `w-full text-left p-3 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary
//                    ${isDisabled ? "opacity-60 cursor-not-allowed bg-muted" : "hover:bg-accent hover:text-accent-foreground"}`
//                 }
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="font-medium">{requirement.operation}</div>
//                   {statusBadges.length > 0 && (
//                     <div className="text-xs text-muted-foreground ml-2">
//                       {statusBadges.join(", ")}
//                     </div>
//                   )}
//                 </div>

//                 {requirement.condition && (
//                   <div className="text-sm text-muted-foreground mt-1">
//                     Condition: {requirement.condition}
//                   </div>
//                 )}

//                 {isDisabled && (
//                   <div className="text-xs text-yellow-600 mt-1">
//                     ⚠️ Already has linked {isConditionMode ? "condition" : "activity"}
//                   </div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="text-center py-8 text-muted-foreground">
//           {emptyMessage}
//           <div className="mt-2 text-sm">
//             {allRequirements?.length ?? 0} total requirements.
//             <div>
//               {Object.keys(statuses).length > 0 && (
//                 <span>{Object.values(statuses).filter(s => s.hasActivity).length} requirements already linked to activities. </span>
//               )}
//               {Object.keys(statuses).length > 0 && (
//                 <span>{Object.values(statuses).filter(s => s.hasCondition).length} requirements already linked to conditions.</span>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </Dialog>
//   );
// }

"use client";
import { useEffect, useMemo, useState } from "react";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { RequirementDto } from "@repo/shared-schemas";
import { useUseCasesRequirements } from "../../requirement/hooks/useUseCaseRequirements";
import { requirementClient } from "../../requirement/api/clients/requirement-client";

interface RequirementSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  isConditionMode?: boolean; // true when selecting requirement for creating a CONDITION
  onRequirementSelect: (requirement: RequirementDto) => void;
  availableRequirements?: RequirementDto[];
  checkingRequirements?: Set<string>; // Track which requirements are being verified
}

type RelationStatus = { hasActivity: boolean; hasCondition: boolean };

export default function RequirementSelection({
  isOpen,
  onClose,
  useCaseId,
  isConditionMode = false,
  onRequirementSelect,
  availableRequirements,
  checkingRequirements = new Set(),
}: RequirementSelectionProps) {
  const { data: allRequirements, isError, isLoading, error } = useUseCasesRequirements(useCaseId);

  // Use provided availableRequirements or fall back to all requirements
  const requirementsToShow = availableRequirements || allRequirements || [];

  // Filtering rules:
  // - Condition mode: only show requirements that HAVE a condition string (requirement.condition)
  // - Activity mode: show all requirements
  const filteredRequirements = useMemo(
    () =>
      isConditionMode
        ? requirementsToShow.filter((req) => req.condition && req.condition.trim().length > 0)
        : requirementsToShow,
    [isConditionMode, requirementsToShow],
  );

  // relationship statuses fetched from the server: { [requirementId]: RelationStatus }
  const [statuses, setStatuses] = useState<Record<string, RelationStatus>>({});
  const [isStatusesLoading, setIsStatusesLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // If there are no requirements to check, clear statuses and exit early
    if (!filteredRequirements || filteredRequirements.length === 0) {
      setStatuses({});
      return;
    }

    let mounted = true;
    setIsStatusesLoading(true);

    // Fetch relationship status for each requirement (uses existing single endpoint)
    Promise.all(
      filteredRequirements.map((req) =>
        requirementClient
          .getRequirementRelationships({ requirementId: req.id })
          .then((res) => ({ id: req.id, status: res }))
          .catch((err) => {
            // If a single check fails, we still continue — default to false/false for that item.
            console.error(`Failed to fetch relationships for requirement ${req.id}`, err);
            return { id: req.id, status: { hasActivity: false, hasCondition: false } };
          }),
      ),
    )
      .then((results) => {
        if (!mounted) return;
        const map: Record<string, RelationStatus> = {};
        for (const r of results) map[r.id] = r.status;
        setStatuses(map);
      })
      .finally(() => {
        if (!mounted) return;
        setIsStatusesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, filteredRequirements]);

  console.log("🔍 RequirementSelection Filtering:", {
    isConditionMode,
    totalRequirements: allRequirements?.length ?? 0,
    filteredCount: filteredRequirements?.length ?? 0,
    statusesLoaded: Object.keys(statuses).length,
    isStatusesLoading,
    checkingRequirements: Array.from(checkingRequirements),
  });

  const title = isConditionMode
    ? "Select Requirement for Condition"
    : "Select Requirement for Activity";

  const emptyMessage = isConditionMode
    ? "No requirements with condition templates found for this use case."
    : "No available requirements found for this use case.";

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} className="max-w-lg">
      {/* Loading requirements list */}
      {isLoading && <Loading isOpen={isLoading} message="Loading requirements..." mode="dialog" />}

      {/* Loading relationship checks */}
      {!isLoading && isStatusesLoading && (
        <div className="p-2 text-sm text-muted-foreground">
          Checking requirement relationships...
        </div>
      )}

      {isError && (
        <ErrorMessage
          message={`Error loading requirements: ${(error as any)?.message ?? "Unknown error"}`}
        />
      )}

      {filteredRequirements && filteredRequirements.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto p-1">
          {filteredRequirements.map((requirement) => {
            const status = statuses[requirement.id] ?? { hasActivity: false, hasCondition: false };
            const isChecking = checkingRequirements.has(requirement.id);

            // Determine "used" status depending on mode
            const isUsedByActivity = Boolean(status.hasActivity);
            const isUsedByCondition = Boolean(status.hasCondition);

            // In condition mode, a requirement is "used" if it already has a condition relationship.
            // In activity mode, a requirement is "used" if it already has an activity relationship.
            const isDisabled = isConditionMode ? isUsedByCondition : isUsedByActivity;

            // For clarity display both statuses (activity/condition) if present
            const statusBadges: string[] = [];
            if (isUsedByActivity) statusBadges.push("activity");
            if (isUsedByCondition) statusBadges.push("condition");

            // Show loading state if this requirement is being checked
            if (isChecking) {
              return (
                <div
                  key={requirement.id}
                  className="w-full text-left p-3 border border-border rounded-lg bg-muted opacity-70 cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{requirement.operation}</div>
                    <div className="text-xs text-muted-foreground ml-2">Verifying...</div>
                  </div>
                  {requirement.condition && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Condition: {requirement.condition}
                    </div>
                  )}
                  <div className="text-xs text-blue-600 mt-1">⏳ Checking availability...</div>
                </div>
              );
            }

            return (
              <button
                key={requirement.id}
                onClick={() => {
                  // defensive: do not call if disabled
                  if (isDisabled) return;
                  onRequirementSelect(requirement);
                }}
                disabled={isDisabled}
                className={`w-full text-left p-3 border border-border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary
                   ${isDisabled ? "opacity-60 cursor-not-allowed bg-muted" : "hover:bg-accent hover:text-accent-foreground"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{requirement.operation}</div>
                  {statusBadges.length > 0 && (
                    <div className="text-xs text-muted-foreground ml-2">
                      {statusBadges.join(", ")}
                    </div>
                  )}
                </div>

                {requirement.condition && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Condition: {requirement.condition}
                  </div>
                )}

                {isDisabled && (
                  <div className="text-xs text-yellow-600 mt-1">
                    ⚠️ Already has linked {isConditionMode ? "condition" : "activity"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
          <div className="mt-2 text-sm">
            {allRequirements?.length ?? 0} total requirements.
            <div>
              {Object.keys(statuses).length > 0 && (
                <span>
                  {Object.values(statuses).filter((s) => s.hasActivity).length} requirements already
                  linked to activities.{" "}
                </span>
              )}
              {Object.keys(statuses).length > 0 && (
                <span>
                  {Object.values(statuses).filter((s) => s.hasCondition).length} requirements
                  already linked to conditions.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
