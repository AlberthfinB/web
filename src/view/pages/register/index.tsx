"use client";
import { useState } from "react";
import RegisterForm from "./components/register-form";
import RoleCard from "./components/role-card";

export default function RegisterView() {
   const [role, setRole] = useState<string | null>(null);

   const handleRoleSelect = (selectedRole: string) => {
      setRole(selectedRole);
   }

   return (
      <>
         {role === null ? (
            <div className="hero min-h-screen bg-[url('/color-run.jpg')] bg-cover bg-center">
               <div className="hero-overlay bg-black/85"></div>
               <div className="hero-content flex-col w-full">
                  <div className="flex justify-center items-center h-full space-x-11">
                     <RoleCard
                        role="Participant"
                        imageSrc="/participant-illustrator.webp"
                        onSelect={handleRoleSelect}
                     />
                     <RoleCard
                        role="Event Organizer"
                        imageSrc="/event-organizer-illustrator.webp"
                        onSelect={handleRoleSelect}
                     />
                  </div>
               </div>
            </div>
         ) : (
            <RegisterForm role={role} />
         )}
      </>
   )
}