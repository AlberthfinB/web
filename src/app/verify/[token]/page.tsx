"use client";
import ErrorHandler from "@/app/lib/error-handler";
import axiosInstance from "@/app/utils/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

interface VerifyPageProps {
   params: Promise<{ token: string }>;
}

export default function VerifyPage({ params }: VerifyPageProps) {
   const router = useRouter();
   const { token } = React.use(params);
   // console.log("tokenzzz", token);

   async function verify() {
      try {
         const headers = {
            'Authorization': `Bearer ${token}`,
         };
         // console.log("Headers:", headers);

         const { data } = await axiosInstance.get("/auth/verify", {
            headers: headers,
         });

         Swal.fire({
            title: data.message,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
         }).then(() => router.push("/login"));
      } catch (error) {
         ErrorHandler(error as Error | AxiosError);
      }
   }

   return (
      <div className='flex flex-col justify-center items-center min-h-screen'>
         <h1 className='text-3xl font-bold p-3'>Click this button below to verify</h1>
         <button onClick={verify} className="group flex items-center justify-start w-11 h-11 bg-green-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1">
            <div className="flex items-center text-white justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
               </svg>
            </div>
            <div className="absolute right-7 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
               Verify
            </div>
         </button>
      </div>
   );
};