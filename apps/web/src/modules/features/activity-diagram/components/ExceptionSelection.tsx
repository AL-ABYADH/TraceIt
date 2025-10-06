// "use client";

// import Dialog from "@/components/Dialog";
// import Loading from "@/components/Loading";
// import ErrorMessage from "@/components/ErrorMessage";
// import { AlertTriangle, X } from "lucide-react";
// import { useExceptions } from "../hooks/useUseCaseExceptions";
// import { useState } from "react";
// import NameInput from "@/components/NameInput";

// interface ExceptionSelectionProps {
//   isOpen: boolean;
//   onClose: () => void;
//   useCaseId: string;
//   onExceptionSelect: (exception: { id: string; name: string }) => void;
// }

// export default function ExceptionSelection({
//   isOpen,
//   onClose,
//   useCaseId,
//   onExceptionSelect,
// }: ExceptionSelectionProps) {
//   const { data: exceptions, isError, isLoading, error } = useExceptions(useCaseId);
//   const [selectedException, setSelectedException] = useState<{ id: string; name: string } | null>(null);
//   const [isNameInputOpen, setIsNameInputOpen] = useState(false);

//   const handleExceptionClick = (exception: { id: string; name: string }) => {
//     setSelectedException(exception);
//     setIsNameInputOpen(true);
//   };

//   const handleNameConfirm = (name: string) => {
//     if (selectedException) {
//       onExceptionSelect({
//         id: selectedException.id,
//         name: name
//       });
//       setSelectedException(null);
//       setIsNameInputOpen(false);
//       onClose();
//     }
//   };

//   const handleNameInputClose = () => {
//     setSelectedException(null);
//     setIsNameInputOpen(false);
//   };

//   return (
//     <>
//       <Dialog
//         isOpen={isOpen}
//         onClose={onClose}
//         title=""
//         className="max-w-lg p-0 overflow-hidden"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
//           <div className="flex items-center gap-3">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
//               <AlertTriangle className="h-4 w-4 text-red-600" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">Select Exception</h2>
//               <p className="text-sm text-muted-foreground mt-0.5">
//                 Choose an exception to add
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {isLoading && (
//             <Loading isOpen={isLoading} message="Loading exceptions..." mode="dialog" />
//           )}
//           {isError && <ErrorMessage message={`Error loading exceptions: ${error!.message}`} />}

//           {exceptions && exceptions.length > 0 ? (
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {exceptions.map((exception) => (
//                 <button
//                   key={exception.id}
//                   onClick={() => handleExceptionClick({
//                     id: exception.id,
//                     name: exception.name
//                   })}
//                   className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
//                       <AlertTriangle className="h-5 w-5 text-red-600" />
//                     </div>
//                     <span className="font-medium text-foreground text-sm group-hover:text-red-700">
//                       {exception.name}
//                     </span>
//                   </div>
//                   <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
//                     <div className="w-2 h-2 border-r-2 border-t-2 border-red-600 rotate-45" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12 text-center">
//               <AlertTriangle className="h-16 w-16 text-muted-foreground/30 mb-4" />
//               <p className="text-muted-foreground font-medium text-lg mb-2">No exceptions found</p>
//               <p className="text-sm text-muted-foreground/70">
//                 Create exceptions first to add them to decision nodes
//               </p>
//             </div>
//           )}
//         </div>
//       </Dialog>

//       {/* Name Input Dialog for renaming */}
//       <NameInput
//         isOpen={isNameInputOpen}
//         onClose={handleNameInputClose}
//         initialName={selectedException?.name || ""}
//         onConfirm={handleNameConfirm}
//       />
//     </>
//   );
// }

"use client";

import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { AlertTriangle, X } from "lucide-react";
import { useExceptions } from "../hooks/useUseCaseExceptions";
import { RequirementExceptionDto } from "@repo/shared-schemas";

interface ExceptionSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  useCaseId: string;
  onExceptionSelect: (exception: RequirementExceptionDto) => void;
}

export default function ExceptionSelection({
  isOpen,
  onClose,
  useCaseId,
  onExceptionSelect,
}: ExceptionSelectionProps) {
  const { data: exceptions, isError, isLoading, error } = useExceptions(useCaseId);

  const handleExceptionClick = (exception: RequirementExceptionDto) => {
    onExceptionSelect(exception);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="" className="max-w-lg p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Select Exception</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Choose an exception to add</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading && <Loading isOpen={isLoading} message="Loading exceptions..." mode="dialog" />}
        {isError && <ErrorMessage message={`Error loading exceptions: ${error!.message}`} />}

        {exceptions && exceptions.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {exceptions.map((exception) => (
              <button
                key={exception.id}
                onClick={() => handleExceptionClick(exception)}
                className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-medium text-foreground text-sm group-hover:text-red-700">
                    {exception.name}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  <div className="w-2 h-2 border-r-2 border-t-2 border-red-600 rotate-45" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium text-lg mb-2">No exceptions found</p>
            <p className="text-sm text-muted-foreground/70">
              Create exceptions first to add them to decision nodes
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
