"use client";
import axiosInstance from "@/app/utils/axios";
import { useState, useEffect } from "react";
import ErrorHandler from "@/app/lib/error-handler";
import { IEventDetails } from "../types";
import { EventDetailProps } from "../types";



export default function EventCompleted({ event_id }: EventDetailProps) {
    const [eventDetail, setEventDetail] = useState<IEventDetails | null>(null);
    const [eventReview, setEventReview] = useState([]);

    const getEventReview = async () => {
        try {
            const response = await axiosInstance.get(
                `/transaction/event/${event_id}`
            );
            setEventReview(response.data);
        } catch (err) {
            ErrorHandler(err as Error);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get(
                    `/management/event/${event_id}`
                );
                setEventDetail(response.data.eventByid);
                getEventReview();
            } catch (err) {
                ErrorHandler(err as Error);
            }
        };
        fetch();
    }, [event_id]);

    return (
        <>
            <div className="container mx-auto p-2">
                <div className="grid grid-cols-5 gap-4">
                    <div className="card bg-white col-span-2">
                        <figure>
                            <img
                                src={eventDetail?.image_event}
                                alt={eventDetail?.name_event}
                                className="w-full max-h-[55rem] lg:rounded-lg"
                            />
                        </figure>
                    </div>

                    <div className="col-span-2 bg-base-60 shadow-xl">
                        <h1 className="text-4xl font-bold m-6">{eventDetail?.name_event}</h1>
                        <div className="m-6">
                            <h1 className="mt-4 text-md">
                            </h1>
                        </div>
                        <hr />
                        <div className="m-6">
                            <p className="mt-4 text-lg font-bold">Location :</p>
                            <p className="text-md">{eventDetail?.location}</p>
                        </div>
                        <div className="m-6">
                            <p className="mt-4 text-lg font-bold">About this event :</p>
                            <p className="text-md">{eventDetail?.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 pt-5 text-center">
                <div className="carousel w-full max-w-4xl space-x-4 p-4">
                    {eventReview.length > 0 && eventReview.map((data: any, index: number) => (
                        <div id={(index + 1).toString()} className="carousel-item w-full" key={index}>
                            <div className="card w-full bg-orange-200 shadow-xl">
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">{data?.user?.name}</h2>
                                    <p>{data?.review}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
