"use client";
import { Formik, Form, FormikProps } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/app/utils/axios";
import ILogin from "../types";
import Schema from "./schema";
import ErrorHandler from "@/app/lib/error-handler";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import useAuthStore, { IUser } from "@/stores/auth.store";
import Link from "next/link";
import { useState } from "react";
import Loader from "@/view/components/loader";
import { AxiosError } from "axios";

const HandleLogin = async (onAuthSucces: (user: IUser | null) => void) => {
   try {
      const access_token = getCookie("access_token") || "";

      if (access_token) {
         const user: IUser = jwtDecode(access_token as string);
         setCookie("access_token", access_token);
         onAuthSucces(user);
      }
      return;
   } catch (err) {
      deleteCookie("access_token");
      throw err;
   }
};

export default function LoginForm() {
   const { onAuthSuccess } = useAuthStore();
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   const login = async (params: ILogin) => {
      setLoading(true);
      try {
         const { data } = await axiosInstance.post("/auth/login", params);

         await HandleLogin(onAuthSuccess);

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
            title: data.message,
         }).then(() => { router.push("/") });
      } catch (err) {
         ErrorHandler(err as Error | AxiosError);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 3500);
      }
   };

   return (
      <div>
         <Formik
            initialValues={{
               email: "",
               password: "",
            }}
            validationSchema={Schema}
            onSubmit={(values) => {
               login(values);
            }}
         >
            {(props: FormikProps<ILogin>) => {
               const { values, errors, touched, handleChange } = props;
               return (
                  <div className="hero min-h-screen bg-[url('/matsuri.webp')] bg-cover bg-center">
                     <div className="hero-overlay bg-black/60"></div>
                     <div className="hero-content flex-col w-full">
                        <div className="text-center lg:text-left">
                           {/* <h1 className="text-5xl font-bold text-white">Login</h1> */}
                        </div>
                        <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-white/10 backdrop-blur-sm rounded-xl">
                           <Form className="card-body">
                              <div className="relative form-control">
                                 <input
                                    className={`px-2.5 py-2 w-full text-base text-white rounded-lg border ${touched.email && errors.email
                                       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                       : "border-gray-200 focus:ring-yellow-300 focus:border-yellow-300"
                                       } bg-white/10 focus:outline-none focus:ring-0 focus:ring-yellow-300 focus:border-yellow-300 peer`}
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder=""
                                    onChange={handleChange}
                                    value={values.email}
                                 />
                                 <label htmlFor="email" className="absolute text-base font-semibold text-gray-100 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-accent-100 px-2 peer-focus:px-2 peer-focus:border-accent-700  peer-focus:text-accent-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none">
                                    Email
                                 </label>
                              </div>
                              {touched.email && errors.email ? (
                                 <small className="text-red-500 text-sm font-bold bg-white/55 rounded px-3 py-1">
                                    {errors.email}
                                 </small>
                              ) : null}
                              <div className="relative form-control mt-3">
                                 <input
                                    className={`px-2.5 py-2 w-full text-base text-white rounded-lg border ${touched.email && errors.email
                                       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                       : "border-gray-200 focus:ring-yellow-300 focus:border-yellow-300"
                                       } bg-white/10 focus:outline-none focus:ring-0 focus:ring-yellow-300 focus:border-yellow-300 peer`}
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder=""
                                    onChange={handleChange}
                                    value={values.password}
                                 />
                                 <label htmlFor="password" className="absolute text-base font-semibold text-gray-100 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-accent-100 px-2 peer-focus:px-2 peer-focus:border-accent-700  peer-focus:text-accent-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none">
                                    Password
                                 </label>
                              </div>
                              {touched.password && errors.password ? (
                                 <small className="text-red-500 text-sm font-bold bg-white/55 rounded px-3 py-1">
                                    {errors.password}
                                 </small>
                              ) : null}
                              <div className="text-right mt-2">
                                 <Link href="/forgot-password" className="text-sm text-yellow-400 hover:underline rounded px-3 py-2 transition duration-200">
                                    Forgot Password?
                                 </Link>
                              </div>
                              <div className="form-control mt-2">
                                 <button className="btn btn-primary w-full bg-blue-500 hover:bg-blue-700 text-white text-lg rounded-xl" disabled={loading}>
                                    {loading ? <Loader /> : 'Login'}
                                 </button>
                              </div>
                              <div className="text-center mt-4">
                                 <p className="text-sm text-white/80">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register"
                                       className="text-yellow-400 font-semibold hover:underline transition-all duration-300">
                                       Register here
                                    </Link>
                                 </p>
                              </div>
                           </Form>
                        </div>
                     </div>
                  </div>
               );
            }}
         </Formik>
      </div>
   );
}
