// // "use client";

// // interface SuccessNotificationProps {
// //   message: string;
// //   onClose: () => void;
// // }

// // export function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
// //   return (
// //     <div className="fixed top-4 right-4 z-50 max-w-xs w-full bg-green-50 border border-green-200 rounded-lg shadow-lg p-3 transition-all duration-300 ease-in-out">
// //       <div className="flex items-start">
// //         <div className="flex-shrink-0 text-green-500 mt-0.5">
// //           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //           </svg>
// //         </div>
// //         <div className="ml-2 flex-1">
// //           <p className="text-sm font-medium text-green-800">{message}</p>
// //         </div>
// //         <button
// //           onClick={onClose}
// //           className="ml-2 flex-shrink-0 inline-flex text-green-400 hover:text-green-600 focus:outline-none focus:text-green-600 transition ease-in-out duration-150"
// //         >
// //           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
// //           </svg>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// interface SuccessNotificationProps {
//   message: string;
//   onClose: () => void;
// }

// export function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
//   return (
//     <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white/80 border border-green-200/50 text-green-800 rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out backdrop-blur-md">
//       <div className="flex items-start">
//         <div className="flex-shrink-0 text-green-500">
//           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//           </svg>
//         </div>
//         <div className="ml-3 flex-1">
//           <p className="text-sm font-medium">{message}</p>
//         </div>
//         <button
//           onClick={onClose}
//           className="ml-auto flex-shrink-0 inline-flex text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition ease-in-out duration-150"
//         >
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
}

export function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-black/80 border border-white/30 text-white rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out backdrop-blur-md">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-green-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 inline-flex text-white/70 hover:text-white focus:outline-none focus:text-white transition ease-in-out duration-150"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
