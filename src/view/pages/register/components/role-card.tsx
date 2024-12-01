import Image from "next/image";

interface IRoleCardProps {
   role: string;
   imageSrc: string;
   onSelect: (role: string) => void;
}

export default function RoleCard({ role, imageSrc, onSelect }: IRoleCardProps) {
   return (
      <div className="card card-compact w-96 hover:border-2 hover:border-yellow-300 cursor-pointer hover:scale-105 transition-transform duration-500" onClick={() => onSelect(role)}>
         <figure className="relative">
            <Image
               src={imageSrc}
               alt={role}
               width={384}
               height={224}
               className="object-cover h-56 w-full rounded-xl" />
            <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded-xl">
               <h3 className="text-xl text-white font-semibold">{role}</h3>
            </div>
         </figure>
      </div>
   );
}