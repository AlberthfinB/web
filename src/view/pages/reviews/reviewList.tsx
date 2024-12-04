"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import ModalCreateReview from "./ModalCreateReview";
import { getCookie } from "cookies-next";
import Image from 'next/image';
import useAuthStore, { IUser } from "@/stores/auth.store";
import { jwtDecode } from "jwt-decode";

interface IReviewList {
    name_event: string;
    image_event: string;
    event_id: number;
    description: string;
    location: string;
    testimoni: string;
    transaction_id: number;
}

const ReviewList = () => {
    const [reviewList, setReviewList] = useState<IReviewList[]>([]);
    const [modalCreateReview, setModalCreateReview] = useState<boolean>(false);  
    const [transactionId, setTransactionId] = useState<number>(0)
    const { user, onAuthSuccess, clearAuth } = useAuthStore();

    const getReviewList = async (userId: number) => {
        try {
            const response = await axiosInstance.get(
                `/transaction/${userId}`
            );

            const eventList = response.data.map((item: any) => {
                return {
                    name_event: item.event.name_event,
                    image_event: item.event.image_event,
                    event_id: item.event.event_id,
                    description: item.event.description,
                    location: item.event.location,
                    testimoni: item.review,
                    transaction_id: item.id
                };
            });

            setReviewList(eventList);
        } catch (err) {
            ErrorHandler(err as Error);
        }
    };

    const handleOnClick = async (tId: number) => {
        setTransactionId(tId);
        setModalCreateReview(true);
    };

    useEffect(() => {
        const token = getCookie("access_token");
        if (token) {
          const decodedUser: IUser = jwtDecode(token as string);
          onAuthSuccess(decodedUser);
        }
      }, [onAuthSuccess]);

    useEffect(() => {
        if (user) {
          try {
            getReviewList(user.user_id);
          } catch (error) {
            console.error("Error parsing user cookie:", error);
          }
        }
      }, [user]);


    return (
        <div>
            <div className="container mx-auto p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-semibold mb-6">Review List</h1>
                </div>

                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Description</th>
                                <th>Review Note</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewList.length > 0 && reviewList.map((event) => (
                                <tr key={event.transaction_id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <Image
                                                        src={event.image_event}
                                                        alt={event.name_event}
                                                        width={500} // Specify width
                                                        height={300} // Specify height
                                                        priority={true} // Optional: Use for LCP-critical images
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="badge badge-lg badge-warning">{event.name_event}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-bold">{event.location}</span>
                                    </td>
                                    <td>{event.description}</td>
                                    <td>{event.testimoni}</td>
                                    <th>
                                        {event.testimoni ? (
                                            <button className="btn btn-sm btn-disabled ">Reviewed</button>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleOnClick(event.transaction_id)}
                                            >
                                                Review
                                            </button>
                                        )}
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModalCreateReview
                open={modalCreateReview}
                setOpen={setModalCreateReview}
                transactionId={transactionId}
                getReviewList={getReviewList}
            />
        </div>
    );
};

export default ReviewList;
