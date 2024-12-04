import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import ErrorHandler from "@/app/lib/error-handler";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next";
import useAuthStore, { IUser } from "@/stores/auth.store";
import { jwtDecode } from "jwt-decode";

interface ModalCreateReviewProps {
    open: boolean; 
    setOpen: React.Dispatch<React.SetStateAction<boolean>>; 
    transactionId: number;
    getReviewList: (transactionId: number) => Promise<void>;
  }

  const ModalCreateReview: React.FC<ModalCreateReviewProps> = ({
    open,
    setOpen,
    transactionId,
    getReviewList
}) => {


    const [note, setNote] = useState("");
    const { user, onAuthSuccess, clearAuth } = useAuthStore();

    const handleChangeNote = (e: any) => {
        setNote(e.target.value);
    };

    useEffect(() => {
        const token = getCookie("access_token");
        if (token) {
          const decodedUser: IUser = jwtDecode(token as string);
          onAuthSuccess(decodedUser);
        }
      }, [onAuthSuccess]);


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const payload = {
            review: note
        }

        try {
            const response = await axiosInstance.patch(
                `transaction/review/${transactionId}`,
                payload,
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: response.data?.message,
                    showConfirmButton: false,
                    timer: 2000,
                })
                setOpen(false);
                getReviewList(user?.user_id as number)
            }
        } catch (err) {
            ErrorHandler(err as Error);
        }
    };


    return (
        <div>
            <dialog
                id="modal-add-review"
                className="modal modal-bottom sm:modal-middle"
                open={open}
                onClose={() => setOpen(false)}
            >

                <div className="modal-box bg-white text-black">
                    <h3 className="font-bold text-lg py-2">Add Review</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div>

                                <div className="mb-4">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="note"
                                    >
                                        Note
                                    </label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        className="textarea min-h-[8.2rem] textarea-bordered w-full bg-white border-2 border-gray-500 mt-1"
                                        onChange={handleChangeNote}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>

                </div>

            </dialog>
        </div>
    );
};

export default ModalCreateReview;
