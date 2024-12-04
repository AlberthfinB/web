"use client"
import ErrorHandler from "@/app/lib/error-handler";
import axiosInstance from "@/app/utils/axios";
import useAuthStore from "@/stores/auth.store";
import { useEffect, useState } from "react";

interface Coupon {
    code: string;
    discount: number;
    valid_from: string;
    valid_until: string;
}

export default function ProfileView() {
    const { user } = useAuthStore();
    const [userPoint, setUserPoint] = useState<number | null>(null);
    const [expiryDate, setExpiryDate] = useState<string | null>(null);
    const [referalCode, setReferalCode] = useState<string | null>(null);
    const [userCoupon, setUserCoupon] = useState<Coupon | null>(null);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    }

    useEffect(() => {
        const getUserPoint = async () => {
            try {
                const response = await axiosInstance.get(`/user/point?user=${user?.user_id}`);
                // console.log(response.data);
                const userPointsData = response.data.data[0];
                // console.log(userPointsData);

                setUserPoint(userPointsData?.points || 0);
                setExpiryDate(userPointsData?.expiry_date ? formatDate(userPointsData?.expiry_date) : "N/A");
            } catch (error) {
                ErrorHandler(error as Error);
                setUserPoint(0);
                setExpiryDate("N/A");
            }
        }
        if (user) {
            getUserPoint();
        }
    }, [user]);

    useEffect(() => {
        const getUserCoupon = async () => {
            try {
                const response = await axiosInstance.get(`/user/coupon?user=${user?.user_id}`);
                // console.log(response.data);
                const data = response.data.data[0];

                setUserCoupon(data || null);
            } catch (error) {
                ErrorHandler(error as Error);
            }
        }
        if (user) {
            getUserCoupon();
        }
    }, [user]);

    useEffect(() => {
        const getReferalCode = async () => {
            try {
                const response = await axiosInstance.get("/auth/referral-code");
                // console.log(response.data);
                setReferalCode(response.data.data);
            } catch (error) {
                ErrorHandler(error as Error);
            }
        }

        if (user) {
            getReferalCode();
        }
    }, [user])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
                    <p className="text-gray-500">{user?.email}</p>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Points:</span>
                        <span>{userPoint}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Points expired:</span>
                        <span>{expiryDate}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                        <span>Referral Code:</span>
                        <span className="font-medium">{referalCode}</span>
                    </div>

                    {userCoupon && (
                        <div className="flex flex-col text-sm text-gray-700 mt-2">
                            <div className="coupon border-dashed border-2 border-gray-400 rounded-lg p-4 bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-blue-500">Coupon Code:</span>
                                    <span className="font-medium text-blue-500">{userCoupon.code}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Discount:</span>
                                    <span>{userCoupon.discount * 100}%</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Valid From:</span>
                                    <span>{formatDate(userCoupon.valid_from)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Valid Until:</span>
                                    <span>{formatDate(userCoupon.valid_until)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
