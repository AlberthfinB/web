"use client";
import ErrorHandler from "@/app/lib/error-handler";
import axiosInstance from "@/app/utils/axios";
import useAuthStore, { IUser } from "@/stores/auth.store";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function NavbarMenu() {
  const router = useRouter();
  const { user, onAuthSuccess, clearAuth } = useAuthStore();
  const [userPoint, setUserPoint] = useState<number | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

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
    const token = getCookie("access_token");
    if (token) {
      const decodedUser: IUser = jwtDecode(token as string);
      onAuthSuccess(decodedUser);
    }
  }, [onAuthSuccess]);

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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Logging out...",
        text: "Please wait a moment, we log you out.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        setTimeout(async () => {
          clearAuth();
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: "success",
            title: "You have been logged out.",
          }).then(() => { router.push("/") });
        }, 1500)
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: 'Failed to log out. Please try again later.' + error,
          icon: "error",
        });
      }
    }
  }

  const handleLogin = async () => {
    router.push(`/login`);
  };

  const handleEvent = async () => {
    router.push(`/event`);
  };

  const handleMain = async () => {
    router.push(`/`);
  };

  const handleProfile = async () => {
    router.push(`/profile`);
  }

  const handleReviews = async () => {
    router.push(`/reviews`);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" onClick={handleMain}>Mini Project</a>
      </div>
      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1 flex items-center">
          {user?.role && user?.role === "Event Organizer" && (
            <li>
              <div className="font-bold" onClick={handleEvent}>
                Create Event
              </div>
            </li>
          )}
          {user?.role && user?.role === "Participant" && (
            <li>
              <div className="font-bold" onClick={handleReviews}>
                Reviews
              </div>
            </li>
          )}

          <li>
            {user ? (
              <div className="flex-none gap-1">
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                      {user?.role === "Event Organizer" ? (
                        <Image
                          alt="Event Organizer"
                          src="/event-organizer-vector.webp"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <Image
                          alt="participant"
                          src="/participant-vector.webp"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-72 shadow" style={{ marginTop: '1rem' }}>
                    <li className="cursor-default hover:rounded-b-none">
                      <div className="text-base-content font-bold text-wrap">Welcome, <br /> {user?.name}</div>
                    </li>
                    <hr />
                    {user?.role && user?.role === "Participant" && (
                      <>
                        <li>
                          <div className="font-bold flex items-center" onClick={handleProfile}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5-2.015-4.5-4.5S9.515 5.25 12 5.25s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0 0c-2.485 0-4.5 2.015-4.5 4.5v.75h9v-.75c0-2.485-2.015-4.5-4.5-4.5z" />
                            </svg>
                            Profile
                          </div>
                        </li>
                        <li className="hover:bg-base-200 flex flex-col">
                          <table>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="flex flex-row text-blue-600 text-bold items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                    <span>Information</span>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="font-bold text-black">Points</div>
                                </td>
                                <td>
                                  <div className="font-bold text-black px-1">:</div>
                                </td>
                                <td>
                                  <div className="font-bold px-1">{userPoint !== null ? userPoint.toLocaleString() : "0"}</div>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="font-bold text-black">Expired at</div>
                                </td>
                                <td>
                                  <div className="font-bold text-black px-1">:</div>
                                </td>
                                <td>
                                  <div className="font-bold px-1 text-nowrap">{expiryDate || "N/A"}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </li>
                      </>
                    )}
                    <hr />
                    <li className="hover:bg-base-200 rounded-b-lg">
                      <div className="font-bold" onClick={handleLogout}>Logout</div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="font-bold" onClick={handleLogin}>
                Log In
              </div>
            )}
          </li>
        </ul>
      </div>
    </div >
  );
}
