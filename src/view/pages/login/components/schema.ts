import { object, string } from "yup";

const Schema = object({
   email: string().email("Invalid Email").required("Required"),
   password: string().required("Required"),
});

export default Schema;