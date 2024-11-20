"use client";

import ErrorHandler from "@/app/lib/error-handler";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
interface ISwiper {
    name_event:string;
    image_event:string;
    event_id : number
}

export default function SwiperComponent() {
  const router = useRouter();
  const [data, setData] = useState<ISwiper[]>([]);
  
  const getEventComing = async () => {
    try {
      const response = await axiosInstance.get("/management/events-coming");
      setData(response.data.data);
      
    } catch (err) {
      ErrorHandler(err);
    }
  };
 
  const handlerClick = async(event_id:number) => {
    router.push(`/event-detail/${event_id}`)
  //   router.push({
  //     pathname: '/event-detail/[id]',
  //     query: {id:},
  // });
  }

  useEffect(() => {
    getEventComing();
    
  }, []);

  return (
    <div className="w-full">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        navigation={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        className="w-full lg:w-[80%]"
        loop={true}
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        {data &&
          data.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-auto cursor-pointer"
               >
                <Image
                  src={event.image_event}
                  alt={event.name_event || "Event Image"}
                  width={200}
                  height={200}
                  layout="responsive"
                  className="rounded-lg"
                  style={{ objectFit: "cover" }}
                  onClick={() => handlerClick(event?.event_id)}
                />
                <h3 className="mt-2 text-left pl-7 text-sm font-semibold lg:text-center lg:text-lg lg:p-0">
                  {event.name_event}
                </h3>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
