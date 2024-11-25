"use client";
import axiosInstance from "@/app/utils/axios";
import { useState, useEffect } from "react";
import ErrorHandler from "@/app/lib/error-handler";
import { EventDetailProps , IEventDetail } from "./types";


export default function EventDetail({ event_id }: EventDetailProps) {
  const [eventDetail, setEventDetail] = useState<IEventDetail | null>(null);

  const dateString = eventDetail?.event_expired?? "1970-01-01T00:00:00Z";

  // Mengonversi string tanggal menjadi objek Date
  
  const date = new Date(dateString);

  // Memformat tanggal menjadi format "30 November 2024"
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axiosInstance.get(
          `/management/event/${event_id}`
        );
        setEventDetail(response.data.eventByid);
        console.log(response);
      } catch (err) {
        ErrorHandler(err);
      }
    };
    fetch();
  }, [event_id]);

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
              {formattedDate}, {formattedTime}
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
            <p className="text-md">{eventDetail?.seats}</p>
          </div>
          {eventDetail?.ticket_price && eventDetail?.ticket_price > 0 && (
            <div className="m-6">
              <p className="mt-4 text-lg font-bold">Ticket Price :</p>
              <p className="text-md">{eventDetail?.ticket_price}</p>
            </div>
          )}
        </div>

        <div className="col-span-1">
          <div className="container mx-auto p-6 shadow-xl rounded-lg">
            <h1 className="text-lg font-bold text-center mb-2">
              Select Ticket
            </h1>
            <div className="flex justify-center items-center space-x-4">
              {/* Tombol untuk mengurangi jumlah */}
              <button
                onClick={decreaseQuantity}
                disabled={quantity === 1} // Menonaktifkan tombol jika quantity == 1
                className="btn border-0 primary-color w-12 h-12 rounded-lg"
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
                className="btn border-0 primary-color w-12 h-12 rounded-lg"
              >
                +
              </button>
            </div>

            <div className="text-center mt-2">
              <button className="btn border-0 primary-color rounded-lg">
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
