"use client";
import { Form, Formik, FormikProps } from "formik";
import Schema from "./schema";
import IRegister from "../types";
import { useState } from "react";
import ErrorHandler from "@/app/lib/error-handler";
import { AxiosError } from "axios";
import axiosInstance from "@/app/utils/axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/view/components/loader";

interface IRegisterFormProps {
   role: string;
}

export default function RegisterForm({ role }: IRegisterFormProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   const register = async (params: IRegister) => {
      setLoading(true);
      try {
         const data = await axiosInstance.post("/auth/register", params);
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
            title: data.data.message,
         }).then(() => router.push("/login"));
      } catch (error) {
         ErrorHandler(error as Error | AxiosError);
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 3500);
      }
   };

   return (
      <>
         <Formik initialValues={{
            name: "",
            email: "",
            password: "",
            role: role,
            referal_code: ""
         }}
            validationSchema={Schema}
            onSubmit={(values) => {
               register(values);
            }}
         >
            {(props: FormikProps<IRegister>) => {
               const { values, errors, touched, handleChange } = props;
               return (
                  <div className="hero min-h-screen bg-[url('/bali-2.jpg')] bg-cover bg-center">
                     <div className="hero-overlay bg-black/60"></div>
                     <div className="hero-content flex-col w-full">
                        <div className="text-center lg:text-left">
                           {/* <h1 className="text-5xl font-bold text-white">Login</h1> */}
                        </div>
                        <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-white/10 backdrop-blur-sm rounded-xl">
                           <Form className="card-body">
                              <h1 className="text-2xl font-bold text-white text-center uppercase mb-1">{values.role === "Participant" ? 'Participant' : 'Event Organizer'}</h1>
                              <div className="relative form-control">
                                 <input
                                    className={`px-2.5 py-2 w-full text-base text-white rounded-lg border ${touched.name && errors.name
                                       ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                       : "border-gray-200 focus:ring-yellow-300 focus:border-yellow-300"
                                       } bg-white/10 focus:outline-none focus:ring-0 focus:ring-yellow-300 focus:border-yellow-300 peer`}
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder=""
                                    onChange={handleChange}
                                    value={values.name}
                                 />
                                 <label htmlFor="name" className="absolute text-base font-semibold text-gray-100 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-accent-100 px-2 peer-focus:px-2 peer-focus:border-accent-700  peer-focus:text-accent-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none">
                                    {values.role === "Participant" ? 'Full Name' : 'Company Name'}
                                 </label>
                              </div>
                              {touched.name && errors.name ? (
                                 <small className="text-red-500 text-sm font-bold bg-white/55 rounded px-3 py-1">
                                    {errors.name}
                                 </small>
                              ) : null}
                              <div className="relative form-control mt-2">
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
                                    {values.role === "Participant" ? 'Email' : 'Email Company'}
                                 </label>
                              </div>
                              {touched.email && errors.email ? (
                                 <small className="text-red-500 text-sm font-bold bg-white/55 rounded px-3 py-1">
                                    {errors.email}
                                 </small>
                              ) : null}
                              <div className="relative form-control mt-2">
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
                              {values.role === "Participant" && (
                                 <div className="relative form-control mt-2">
                                    <div>
                                       <input
                                          className={`px-2.5 py-2 w-full text-base text-white rounded-lg border
                                             border-gray-200 bg-white/10 focus:outline-none focus:ring-0 focus:ring-yellow-300 focus:border-yellow-300 peer`}
                                          type="text"
                                          name="referal_code"
                                          id="referal_code"
                                          placeholder=""
                                          value={values.referal_code || ""}
                                          onChange={(e) => {
                                             const upperCaseValue = e.target.value.toUpperCase();
                                             if (upperCaseValue.length <= 16) {
                                                handleChange({
                                                   target: { name: "referal_code", value: upperCaseValue },
                                                });
                                             }
                                          }}
                                          maxLength={16}
                                       />
                                       <label htmlFor="referal_code" className="absolute text-base font-semibold text-gray-100 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] bg-accent-100 px-2 peer-focus:px-2 peer-focus:border-accent-700 peer-focus:text-accent-700 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 pointer-events-none">
                                          Referral Code
                                       </label>
                                    </div>
                                    {values.referal_code && values.referal_code.length === 16 && (
                                       <small className="text-red-500 text-sm font-bold bg-white/55 rounded px-3 py-1 mt-2">
                                          Referral Code can only be 16 characters.
                                       </small>
                                    )}
                                 </div>
                              )}
                              <div className="text-right mt-2">
                                 <Link href="/forgot-password" className="text-sm text-yellow-400 hover:underline rounded px-3 py-2 transition duration-200">
                                    Forgot Password?
                                 </Link>
                              </div>
                              <div className="form-control mt-2">
                                 <button className="btn btn-primary w-full bg-blue-500 hover:bg-blue-700 text-white text-lg rounded-xl" disabled={loading}>
                                    {loading ? <Loader /> : 'Register'}
                                 </button>
                              </div>
                              <div className="text-center mt-4">
                                 <p className="text-sm text-white/80">
                                    Already have an account?{" "}
                                    <Link href="/login"
                                       className="text-yellow-400 font-semibold hover:underline transition-all duration-300">
                                       Login here
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
      </>
   )
}