// "use client";

// import Dialog from "@/components/Dialog";
// import Button from "@/components/Button";
// import { GitBranch, AlertTriangle } from "lucide-react";

// interface DecisionTypeSelectionProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConditionSelect: () => void;
//   onExceptionSelect: () => void;
// }

// export default function DecisionTypeSelection({
//   isOpen,
//   onClose,
//   onConditionSelect,
//   onExceptionSelect,
// }: DecisionTypeSelectionProps) {
//   return (
//     <Dialog
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Add to Decision Node"
//       className="max-w-md"
//     >
//       <div className="space-y-4 p-4">
//         <p className="text-sm text-muted-foreground text-center">
//           What would you like to add to this decision node?
//         </p>

//         <div className="grid grid-cols-1 gap-3">
//           <Button
//             onClick={onConditionSelect}
//             variant="ghost"
//             className="py-4 h-auto flex items-center gap-3 justify-start"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-500/10 rounded-lg">
//                 <GitBranch className="h-5 w-5 text-blue-600" />
//               </div>
//               <div className="text-left">
//                 <div className="font-semibold text-foreground">Add Condition</div>
//                 <div className="text-xs text-muted-foreground mt-0.5">
//                   Select from requirements with conditions
//                 </div>
//               </div>
//             </div>
//           </Button>

//           <Button
//             onClick={onExceptionSelect}
//             variant="ghost"
//             className="py-4 h-auto flex items-center gap-3 justify-start"
//           >
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-orange-500/10 rounded-lg">
//                 <AlertTriangle className="h-5 w-5 text-orange-600" />
//               </div>
//               <div className="text-left">
//                 <div className="font-semibold text-foreground">Add Exception</div>
//                 <div className="text-xs text-muted-foreground mt-0.5">
//                   Select from existing exceptions
//                 </div>
//               </div>
//             </div>
//           </Button>
//         </div>
//       </div>
//     </Dialog>
//   );
// }
