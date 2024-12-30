// "use client";

// import { useQuery } from "react-query";
// import { Users, GraduationCap, Landmark, Cpu } from "lucide-react";

// async function fetchStatistics() {
//   // In a real application, this would be an API call
//   return {
//     totalStudents: 1500,
//     GovtEmployes: 250,
//     itProfessionals: 95,
//     freshGraduates: 98,
//   };
// }

// export default function Statistics() {
//   const { data, isLoading, error } = useQuery("statistics", fetchStatistics);

//   if (isLoading) return <div>Loading statistics...</div>;
//   if (error) return <div>Error loading statistics</div>;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//       <div className="bg-white rounded-lg shadow p-5">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
//             <Users className="h-8 w-8 text-white" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">
//                 Total Students
//               </dt>
//               <dd className="text-3xl font-semibold text-gray-900">
//                 {data.totalStudents}
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-5">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
//             <Landmark className="h-8 w-8 text-white" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">
//                 Goverment Employes
//               </dt>
//               <dd className="text-3xl font-semibold text-gray-900">
//                 {data.GovtEmployes}
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-5">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
//             <Cpu className="h-8 w-8 text-white" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">
//                 IT Professionals
//               </dt>
//               <dd className="text-3xl font-semibold text-gray-900">
//                 {data.itProfessionals}
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded-lg shadow p-5">
//         <div className="flex items-center">
//           <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
//             <GraduationCap className="h-8 w-8 text-white" />
//           </div>
//           <div className="ml-5 w-0 flex-1">
//             <dl>
//               <dt className="text-sm font-medium text-gray-500 truncate">
//                 Fresh Graduates
//               </dt>
//               <dd className="text-3xl font-semibold text-gray-900">
//                 {data.freshGraduates}
//               </dd>
//             </dl>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
