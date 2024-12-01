import { object, string } from "yup";

const Schema = object({
   name: string().required("Required").min(3, "Name must be at least 3 characters"),
   email: string().email("Invalid Email").required("Required"),
   password:
      string().required("Required")
         .min(6, "Password must be at least 6 characters long")
         .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
   role: string().required("Required"),
});

export default Schema;