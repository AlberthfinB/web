"use client";
import { Formik, Form, FormikProps } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/app/utils/axios";
import ILogin from "../types";
import Schema from "./schema";
import ErrorHandler from "@/app/lib/error-handler";
import { useRouter } from "next/navigation";
import  {jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import useAuthStore, { IUser } from "@/stores/auth.store";

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
 
    const login = async (params: ILogin) => {
       try {
          const { data } = await axiosInstance.post("/auth/login", params);
 
          await HandleLogin(onAuthSuccess);
        
          Swal.fire({
             icon: "success",
             title: data.message,
             showConfirmButton: false,
             timer: 2000,
          }).then(() => router.push("/"));
       } catch (err) {
          ErrorHandler(err);
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
                   <div className="hero bg-base-200 min-h-screen">
                      <div className="hero-content flex-col lg:flex-row-reverse">
                         <div className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Login now!</h1>
                         </div>
                         <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <Form className="card-body">
                               <div className="form-control">
                                  <label htmlFor="email" className="label">
                                     <span className="label-text">Email</span>
                                  </label>
                                  <input
                                     className="input input-bordered"
                                     type="text"
                                     name="email"
                                     onChange={handleChange}
                                     value={values.email}
                                  />
                                  {touched.email && errors.email ? (
                                     <div className="text-red-600">
                                        {errors.email}
                                     </div>
                                  ) : null}
                               </div>
                               <div className="form-control">
                                  <label htmlFor="password" className="label">
                                     <span className="label-text">Password</span>
                                  </label>
                                  <input
                                     className="input input-bordered"
                                     type="password"
                                     name="password"
                                     onChange={handleChange}
                                     value={values.password}
                                  />
                                  {touched.password && errors.password ? (
                                     <div className="text-red-600">
                                        {errors.password}
                                     </div>
                                  ) : null}
                               </div>
                               <div className="form-control mt-6">
                                  <button className="btn btn-primary">
                                     Login
                                  </button>
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
 