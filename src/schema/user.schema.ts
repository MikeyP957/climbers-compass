import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    password: string()
      .required("passowrd is required")
      .min(6, "Password is too short, must be at least 6 characters")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "password can only contain letters and numbers"
      ),
    passwordConfirmation: string().oneOf(
      [ref("password"), null],
      "passwords must match"
    ),
    email: string().email("must be valid email").required("email is required"),
  }),
});
