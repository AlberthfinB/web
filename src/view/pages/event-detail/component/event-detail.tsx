"use client";
import axiosInstance from "@/app/utils/axios";
import { useState, useEffect } from "react";
import ErrorHandler from "@/app/lib/error-handler";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { formatDate,formatTime } from "@/app/helpers/dateFormatter";
import { formatToIDR } from "@/app/helpers/currencyFormatter";
import { getCookie } from "cookies-next";
import Swal from "sweetalert2";
import { IPromotion,IEventDetail,EventDetailProps,IUser } from "../types";

export default function EventDetail({ event_id }: EventDetailProps) {
    const router = useRouter();
    const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);
    const [promoDetail, setPromoDetail] = useState<IPromotion[] | null>(null);
    const [dataUser, setDataUser] = useState<IUser>();
  
    // Mengonversi string tanggal menjadi objek Date
    const date = eventDetail?.event_expired ? new Date(eventDetail.event_expired) : null;
  
    const promoDate = promoDetail?.[0]?.valid_until
  ? new Date(promoDetail[0].valid_until)
  : null;
  
    // State untuk menyimpan jumlah barang yang dipilih
    const [quantity, setQuantity] = useState(1);
  
    // Fungsi untuk menambah jumlah
    const increaseQuantity = () => setQuantity(quantity + 1);
  
    // Fungsi untuk mengurangi jumlah (tidak boleh kurang dari 1)
    const decreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };
  
    const handleCheckOut = () => {
      if (!dataUser?.user_id) {
        Swal.fire({
          icon: "warning",
          title: "Please Log In",
          showConfirmButton: true,
          confirmButtonColor: "#D1410C"
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          } 
        });
      } else {
        const dataCheckout = {
          event: eventDetail,
          quantity: quantity
        };
        setCookie("checkout", dataCheckout);
  
        router.push("/checkout");
      }
    };
  
    useEffect(() => {
      const fetch = async () => {
        try {
          const response = await axiosInstance.get(
            `/management/event/${event_id}`
          );
          setEventDetail(response.data.eventByid);
          setPromoDetail(response.data.eventByid?.Promotion);
        } catch (err) {
          ErrorHandler(err as Error);
        }
      };
      fetch();
    }, [event_id]);
  
    useEffect(() => {
      if (getCookie("user")) {
        const cookieUser = getCookie("user");
        const user: IUser = JSON.parse(cookieUser);
        setDataUser(user);
      }
    }, []);
  
    return (
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
  
          <div className="col-span-2 bg-base-60 shadow-xl min-h-[50rem]">
            <h1 className="text-4xl font-bold m-6">{eventDetail?.name_event}</h1>
            <div className="m-6">
              <h1 className="mt-4 text-md">
                {formatDate(date)}, {formatTime(date)}
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
            <div className="m-6">
              <p className="mt-4 text-lg font-bold">Seats :</p>
              <p className="text-md">{eventDetail?.seats}</p>
            </div>
            <div className="m-6">
              <p className="mt-4 text-lg font-bold">Available Seats :</p>
              <p className="text-md">{eventDetail?.available_seats}</p>
            </div>
            {eventDetail?.ticket_price && eventDetail?.ticket_price > 0 && (
              <div className="m-6">
                <p className="mt-4 text-lg font-bold">Ticket Price :</p>
                <p className="text-md">
                  {formatToIDR(eventDetail?.ticket_price)}
                </p>
              </div>
            )}
          </div>
  
          <div className="col-span-1">
            {eventDetail?.available_seats &&
            Number(eventDetail.available_seats) > 0 ? (
              <div className="container mx-auto p-6 mb-5 shadow-xl rounded-lg">
                <h1 className="text-lg font-bold text-center mb-2">
                  Select Ticket
                </h1>
                <div className="flex justify-center items-center space-x-4">
                  {/* Tombol untuk mengurangi jumlah */}
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity === 1} // Menonaktifkan tombol jika quantity == 1
                    className="btn border-0 primary-color rounded-lg w-12 h-12"
                  >
                    -
                  </button>
  
                  {/* Menampilkan jumlah barang */}
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 h-12 text-center border-2 border-gray-300 bg-white rounded-lg focus:outline-none"
                  />
  
                  {/* Tombol untuk menambah jumlah */}
                  <button
                    onClick={increaseQuantity}
                    className="btn border-0 primary-color rounded-lg w-12 h-12"
                    disabled={
                      quantity === Number(eventDetail?.available_seats)
                        ? true
                        : false
                    }
                  >
                    +
                  </button>
                </div>
  
                <div className="text-center mt-2">
                  <button
                    className="btn border-0 primary-color rounded-lg"
                    onClick={handleCheckOut}
                  >
                    Check Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="container mx-auto p-6 shadow-xl rounded-lg">
                <h1 className="text-lg font-bold text-center mb-2">
                  Ticket Sold Out
                </h1>
              </div>
            )}
  
            {eventDetail?.promotion_type_id &&
              eventDetail?.promotion_type_id > 1 && (
                <div className="container mx-auto p-6 shadow-xl bg-orange-300 rounded-lg">
                  <h1 className="text-lg font-bold text-center mb-2">PROMO</h1>
                  {promoDetail?.length > 0 &&
                    promoDetail[0]?.promotion_type_id === 3 && (
                      <div className="flex justify-center items-center space-x-4">
                        <p>
                          Get a {promoDetail[0]?.discount}% discount promo until{" "}
                          <b>{formatDate(promoDate)} {formatTime(promoDate)}</b>
                        </p>
                      </div>
                    )}
                  {promoDetail?.length > 0 &&
                    promoDetail[0]?.promotion_type_id === 2 && (
                      <div className="flex justify-center items-center space-x-4">
                        <p>
                          Get a 10% discount promo by using your voucher, the
                          remaining quota is <b>{promoDetail[0]?.max_uses}</b>{" "}
                          ticket orders
                        </p>
                      </div>
                    )}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
  