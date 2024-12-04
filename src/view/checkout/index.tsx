"use client";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { formatDate,formatTime } from "@/app/helpers/dateFormatter";
import { formatToIDR } from "@/app/helpers/currencyFormatter";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import Swal from "sweetalert2";
import ModalPayment from "./modal-payment";
import { useRouter } from "next/navigation";
import useAuthStore, { IUser } from "@/stores/auth.store";
import { jwtDecode } from "jwt-decode";

interface Promotion {
  valid_until: string;
  discount: number;
}

interface PromotionType {
  promotion_type_id: number;
  promotion_type: string;
}

interface Event {
  event_id: number;
  name_event: string;
  location: string;
  description: string;
  image_event: string;
  ticket_price: string;
  seats: number;
  available_seats: number;
  create_date: string;
  event_expired: string;
  user_id: number;
  ticket_id: number;
  event_category_id: number;
  promotion_type_id: number;
  promotion_type: PromotionType;
  status_event_id: number;
  Promotion: Promotion[]; // Optional karena tidak semua event memiliki promosi
}

interface EventResponse {
  event: Event;
  quantity: number;
}

interface ICoupon {
  id: number;
  code: string;
  discount: number;
  max_uses: number;
  used_count: number;
  valid_until: string; // ISO string
}

interface FormData {
  total_price: number;
  discount: number;
  points_used: number;
  coupon_id: number | string;
  event: {
    event_id: number;
    discount: number;
    price: number;
    quantity: number;
    ticket_id: number;
  };
  user_id: number;
}

interface DataCheckout {
  event: Event;
  quantity: number;
}

interface Point {
  id: number;
  user_id: number;
  points: number;
  expiry_date: string; // ISO string
  created_at: string; // ISO string
}

export default function Checkout() {
  const router = useRouter();
  const { user, onAuthSuccess, clearAuth } = useAuthStore();
  const [dataCheckout, setDataCheckout] = useState<EventResponse | null>(null);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [subPayment, setSubPayment] = useState<number>(0);
  const [point, setPoint] = useState<number>(0);
  const [coupon, setCoupon] = useState<ICoupon[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [usePoint, setUsePoint] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    total_price: 0,
    discount: 0,
    points_used: 0,
    coupon_id: "",
    event: {
      event_id: 0,
      discount: 0,
      price: 0,
      quantity: 0,
      ticket_id: 0,
    },
    user_id: 0,
  });

  const getPoints = async (
    user_id: number
  ) => {
    try {
      const response = await axiosInstance.get<{ data: Point[] }>(
        `/user/point?user=${user_id}`
      );

      const allPoint: Point[] = response.data.data;
      const currentDate = new Date();

      // Filter poin dengan expiry_date lebih dari hari ini
      const validPoints = allPoint.filter(
        (point) => new Date(point.expiry_date) > currentDate
      );

      // Hitung total poin
      const totalPoints = validPoints.reduce(
        (sum, point) => sum + point.points,
        0
      );

      setPoint(totalPoints);
    } catch (err) {
      ErrorHandler(err as Error); // Pastikan ErrorHandler Anda didefinisikan sebelumnya
    }
  };

  const getCoupon = async (user_id: number) => {
    try {
      const response = await axiosInstance.get(`/user/coupon?user=${user_id}`);
      setCoupon(response.data.data);
    } catch (err) {
      ErrorHandler(err as Error);
    }
  };

  const handleCheckbox = (value: string) => {
    if (selectedOption === value) {
      setSelectedOption("");
      setDiscount(0);
    } else {
      setSelectedOption(value);
    }
  };

  const handleCheckboxPoint = () => {
    setUsePoint(!usePoint);
  };

  const handleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const handleCheckOut = async () => {
    if (dataCheckout?.event?.ticket_id === 1) {
      const data = new FormData();
      data.append("total_price", totalPayment.toString());
      data.append("discount", discount.toString());
      data.append("points_used", (usePoint ? point : 0).toString());
      data.append("coupon_id", selectedOption ? selectedOption.toString() : "");
      data.append("event_id", dataCheckout?.event?.event_id.toString());
      data.append("event_discount", discount.toString());
      data.append("event_price", dataCheckout?.event?.ticket_price);
      data.append("event_quantity", dataCheckout?.quantity.toString());
      data.append("event_ticket_id", dataCheckout?.event?.ticket_id.toString());
      data.append("payment_status_id", "1"); // paid
      data.append("user_id", user?.user_id.toString() || "");
      try {
        const response = await axiosInstance.post("/transaction/create", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data?.message === "Success") {
          Swal.fire({
            icon: "success",
            title: `Your transaction id is ${response.data?.data?.id}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/");
            }
          });
        }
      } catch (err) {
        ErrorHandler(err as Error);
      }
    } else {
      setFormData({
        total_price: totalPayment,
        discount: discount,
        points_used: usePoint ? point : 0,
        coupon_id: Number(selectedOption) || "",
        event: {
          event_id: dataCheckout?.event?.event_id || 0,
          discount: discount,
          price: Number(dataCheckout?.event?.ticket_price) || 0,
          quantity: dataCheckout?.quantity || 0,
          ticket_id: dataCheckout?.event?.ticket_id || 0,
        },
        user_id: user?.user_id || 0,
      });

      handleModal();
    }
  };

  useEffect(() => {
    try {
      const checkout = getCookie("checkout") as string;
  
      if (checkout) {
        const dataEvent: EventResponse = JSON.parse(checkout);
  
        const payment =
          Number(dataEvent.event.ticket_price) > 0
            ? Number(dataEvent.event.ticket_price) * dataEvent.quantity
            : Number(dataEvent.event.ticket_price);
  
        if (dataEvent?.event?.promotion_type_id === 3) {
          const currentDate = new Date();
          let paymentDisc = payment;

          if (
            dataEvent?.event?.Promotion?.[0]?.valid_until &&
            new Date(dataEvent.event.Promotion[0].valid_until) < currentDate
          ) {
            setDiscount(0);
          } else {
            const isDiscount: number =
              dataEvent?.event?.Promotion && dataEvent.event.Promotion.length > 0
                ? dataEvent.event.Promotion[0].discount
                : 0;
          
            const disc: number = payment * (isDiscount / 100); // Menghitung diskon
            paymentDisc = payment - disc; // Mengurangi diskon dari total pembayaran
            setDiscount(disc); // Set diskon ke state
          }
  
          setTotalPayment(paymentDisc);
        } else {
          setTotalPayment(payment);
        }
  
        setSubPayment(payment);
        setDataCheckout(dataEvent); // Set dataCheckout dengan array of EventResponse
      }
  
      const cookieUser = getCookie("user") as string;
  
      if (cookieUser) {
        if (user?.user_id) {
          getPoints(user.user_id); // Pastikan getPoints memiliki tipe user_id: number
          getCoupon(user.user_id); // Pastikan getCoupon memiliki tipe user_id: number
        }
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

useEffect(() => {
  if (dataCheckout && dataCheckout?.event?.ticket_price) {
    if (selectedOption === "") {
      const p = usePoint ? point : 0;
      let disc = 0;

      if (
        dataCheckout &&
        dataCheckout.event.promotion_type_id === 3 &&
        dataCheckout.event.Promotion &&
        dataCheckout.event.Promotion.length > 0
      ) {
        disc = discount;
      }

      const sub = subPayment - p - disc;
      setTotalPayment(sub);
    } else {
      const selectedCoupon = coupon.find(
        (c) => c.id === Number(selectedOption)
      );

      if (selectedCoupon) {
        const currentDate = new Date();

        // Validasi apakah kupon sudah kedaluwarsa
        if (new Date(selectedCoupon.valid_until) < currentDate) {
          Swal.fire({
            icon: "error",
            title: "Coupon expired!",
          });
        }
        // Validasi apakah kuota penggunaan kupon habis
        else if (selectedCoupon.used_count >= selectedCoupon.max_uses) {
          Swal.fire({
            icon: "error",
            title: "Voucher usage limit reached!",
          });
        } else {
          const p = usePoint ? point : 0;
          const disc = subPayment * selectedCoupon.discount;
          const total = subPayment - disc - p;

          setDiscount(disc);
          setTotalPayment(total);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Coupon not found!",
        });
      }
    }
  }
}, [selectedOption, usePoint]);

useEffect(() => {
  const token = getCookie("access_token");
  if (token) {
    const decodedUser: IUser = jwtDecode(token as string);
    onAuthSuccess(decodedUser);
  }
}, [onAuthSuccess]);

const eventStart = dataCheckout?.event?.event_expired
  ? new Date(dataCheckout.event.event_expired)
  : null;

const promoValid = dataCheckout?.event?.Promotion?.[0]?.valid_until
  ? new Date(dataCheckout.event.Promotion[0].valid_until)
  : null;

  return (
    <div className="flex items-center justify-center">
      <div className="shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="col-span-2 bg-base-60 min-h-[50rem]">
          <h1 className="text-4xl font-bold m-4 flex justify-center">
            Checkout
          </h1>
          <hr />
          <div className="m-2">
            <p className="mt-4 text-lg font-bold">Event's Name :</p>
            <p className="text-md">{dataCheckout?.event?.name_event}</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <div className="m-2">
                <p className="mt-4 text-lg font-bold">Event's Start :</p>
                <p className="text-md">
                  {formatDate(eventStart)}, {formatTime(eventStart)}
                </p>
              </div>
              <div className="m-2">
                <p className="mt-4 text-lg font-bold">Location :</p>
                <p className="text-md">{dataCheckout?.event?.location}</p>
              </div>
              <div className="m-2">
                <p className="mt-4 text-lg font-bold">Ticket Price :</p>
                <p className="text-md">
                  {formatToIDR(Number(dataCheckout?.event?.ticket_price))}
                </p>
              </div>
              <div className="m-2">
                <p className="mt-4 text-lg font-bold">Total Ticket :</p>
                <p className="text-md">{dataCheckout?.quantity}</p>
              </div>
            </div>

            <div className="col-span-2">
              <div className="m-2">
                <p className="mt-4 text-lg font-bold">Promo :</p>
                <p className="text-md">
                  {dataCheckout?.event?.promotion_type?.promotion_type}
                </p>
              </div>
              {dataCheckout &&
                dataCheckout?.event?.promotion_type_id === 2 &&
                coupon?.length > 0 && (
                  <div className="m-2">
                    <p className="mt-4 text-lg font-bold">Your Voucher :</p>
                    {coupon.map((option, index) => (
                      <label key={index} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          name={`coupon-${index}`}
                          value={option.id}
                          checked={Number(selectedOption) === option.id}
                          onChange={(e) => handleCheckbox(e.target.value)}
                          className="checkbox checkbox-sm checkbox-warning mr-2"
                        />
                        Voucher {option.code} {option.discount * 100}%
                      </label>
                    ))}
                  </div>
                )}

              {dataCheckout && dataCheckout?.event?.promotion_type_id === 3 && (
                <>
                  <div className="m-2">
                    <p className="mt-4 text-lg font-bold">Promo Discount :</p>
                    <p className="text-md">
                      {dataCheckout?.event?.Promotion?.length > 0 ? dataCheckout?.event?.Promotion[0]?.discount : 0}%
                    </p>
                  </div>
                  <div className="m-2">
                    <p className="mt-4 text-lg font-bold">
                      Promo Valid Until :
                    </p>
                    <p className="text-md">
                      {formatDate(promoValid)} {formatTime(promoValid)}
                    </p>
                  </div>
                </>
              )}
              <div className="m-2">
                <p className="mt-4 text-lg font-bold">Your Points :</p>
                <p className="text-md">{formatToIDR(point)}</p>
                {point > 0 && (
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={usePoint}
                      onChange={handleCheckboxPoint}
                      className="checkbox checkbox-sm checkbox-warning mr-2"
                    />
                    Use Point
                  </label>
                )}
              </div>
            </div>
          </div>
          <hr />
          <div className="grid grid-cols-4 gap-3">
            <div className="m-2">
              <p className="mt-4 text-lg font-bold">Sub Payment :</p>
              <p className="text-md">{formatToIDR(subPayment)}</p>
            </div>
            <div className="m-2">
              <p className="mt-4 text-lg font-bold">Discount :</p>
              <p className="text-md">{formatToIDR(discount)}</p>
            </div>
            <div className="m-2">
              <p className="mt-4 text-lg font-bold">Points :</p>
              <p className="text-md">
                {usePoint ? formatToIDR(point) : formatToIDR(0)}
              </p>
            </div>
            <div className="m-2">
              <p className="mt-4 text-lg font-bold">Total Payment :</p>
              <p className="text-md">{formatToIDR(totalPayment)}</p>
            </div>
          </div>

          <div className="m-2">
            <button
              className="btn border-0 primary-color rounded-lg flex w-full"
              onClick={handleCheckOut}
            >
              BUY
            </button>
          </div>
        </div>
      </div>
      <div>
        <ModalPayment
          isOpen={isOpenModal}
          total={totalPayment}
          formData={formData}
        />
      </div>
    </div>
  );
}
