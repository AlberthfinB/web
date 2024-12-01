"use client";
import { formatToIDR } from "@/app/helpers/currencyFormatter";
import { useState } from "react";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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

interface ModalPaymentProps {
  isOpen: boolean;
  total: number;
  formData: FormData;
}


export default function ModalPayment({ isOpen, total, formData }:ModalPaymentProps) {
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const onSubmit = async () => {
    const data = new FormData();
    data.append("total_price", formData.total_price.toString());
    data.append("discount", formData.discount.toString());
    data.append("points_used", formData.points_used.toString());
    if (imageFile) {
      data.append("payment_proof", imageFile); // Tambahkan file
    }
    data.append("coupon_id", formData.coupon_id.toString());
    data.append("event_id", formData.event.event_id.toString());
    data.append("event_discount", formData.event.discount.toString());
    data.append("event_price", formData.event.price.toString());
    data.append("event_quantity", formData.event.quantity.toString());
    data.append("event_ticket_id", formData.event.ticket_id.toString());
    data.append("payment_status_id", "1"); //paid
    data.append("user_id", formData.user_id.toString());

    try {
      const response = await axiosInstance.post("/transaction/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.message === 'Success') {
        Swal.fire({
          icon: "success",
          title: `Your transaction id is ${response.data?.data?.id}`,
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/");
          }
        });
      }
    } catch (err) {
      ErrorHandler(err as Error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);
    }
  };

  return (
    <dialog id="modal-payment" className="modal bg-gray-300" open={isOpen}>
      <div className="modal-box w-11/12 max-w-5xl bg-white">
        <h3 className="font-bold text-lg">Payment!</h3>
        <p className="py-4">Please make payment to the account number below</p>
        <table className="border border-gray-300 text-left">
          <tbody>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Bank</th>
              <td className="border border-gray-300 px-4 py-2">:</td>
              <td className="border border-gray-300 px-4 py-2">BCA</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Nomor Rekening
              </th>
              <td className="border border-gray-300 px-4 py-2">:</td>
              <td className="border border-gray-300 px-4 py-2">10002121</td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Nama Rekening
              </th>
              <td className="border border-gray-300 px-4 py-2">:</td>
              <td className="border border-gray-300 px-4 py-2">
                PT. Mini Project
              </td>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Total Payment
              </th>
              <td className="border border-gray-300 px-4 py-2">:</td>
              <td className="border border-gray-300 px-4 py-2">
                {formatToIDR(total)}
              </td>
            </tr>
          </tbody>
        </table>

        <div>
          <p className="py-4">
            After making a transfer or payment to the account number above,
            please upload proof of payment below
          </p>
          <input
            type="file"
            className="file-input border-2 border-gray-500 bg-white mt-1"
            onChange={handleFileChange}
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={onSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
