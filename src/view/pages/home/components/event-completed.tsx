"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import { useRouter } from "next/navigation";
interface IEventComplete {
    name_event: string;
    image_event: string;
    event_id: number;
    description: string;
    location: string;
}

const EventComplete = () => {
    const router = useRouter();
    const [eventComplete, setEventComplete] = useState<IEventComplete[]>([]);

    const getEventComplete = async () => {
        try {
            const response = await axiosInstance.get(
                `/management/events-complete`
            );
            setEventComplete(response.data);
        } catch (err) {
            ErrorHandler(err as Error);
        }
    };


    useEffect(() => {
        getEventComplete();
    }, []);

    const handleOnClick = async (event_id: number) => {
        router.push(`/event-complete/${event_id}`);
    };


    return (
        <div>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Complete Events</h1>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {eventComplete.map((event) => (
                        <div
                            key={event.event_id}
                            className="card bg-gray-100 shadow-xl rounded-lg overflow-hidden"
                            onClick={() => handleOnClick(event.event_id)}
                        >
                            <figure>
                                <img
                                    src={event.image_event}
                                    alt={event.name_event}
                                    className="w-full h-40 object-cover"
                                />
                            </figure>
                            <div className="card-body p-4">
                                <h2 className="card-title text-lg font-semibold">
                                    {event.name_event}
                                </h2>
                                <p className="text-gray-600 text-sm">{event.location}</p>
                                <p className="text-gray-600 text-sm">{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default EventComplete;
