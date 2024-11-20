"use client"
import axiosInstance from "@/app/utils/axios";
import { useState ,useEffect } from "react";
import ErrorHandler from "@/app/lib/error-handler";

interface IEventDetail {
    name_event: string;
    image_event: string;
    description: string;
    event_expired:string;
  }
  interface EventDetailProps {
    event_id: string;
  }

export default function EventDetail({event_id } : EventDetailProps ) {
    
    const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);
    
   useEffect(() => {
    const fetch = async () =>{
        try{
            const response = await axiosInstance.get(`/management/event/${event_id}`);
            setEventDetail(response.data.eventByid)
            console.log(response);
            
        }catch(err){
            ErrorHandler(err);
        }
    };
        fetch();
   },[event_id])
   
   return (
    <div className="flex justify-center ">
      <div className="">
        <img
          src={eventDetail?.image_event}
          alt={eventDetail?.name_event}
          className="w-full h-auto  lg:w-[90rem] lg:rounded-lg"
        />
      <div className="pl-4  lg:pl-0 ">
        <p className="">{eventDetail?.event_expired}</p>
        <h1 className="text-2xl font-bold pt-5">Title : {eventDetail?.name_event}</h1>
        <p className="mt-4">Description : {eventDetail?.description}</p>
      </div>
      </div>
    </div>
   
   
  );
}