import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, set, string, TypeOf } from "zod";

const createUserSchema = object({
  name: string({
    required_error: "Name is required",
  }),
  password: string({
    required_error: "Password is required",
  }).min(6, "password too short- must be at least 6 characters"),
  passwordConfirmation: string({
    required_error: "Password confirmation is required",
  }),
  email: string({
    required_error: "Email is required",
  }).email("not a valid email"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

function RegisterPage() {
  const [registerError, setRegisterError] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function onSubmit(values: CreateUserInput) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        values
      );
    } catch (err: any) {
      setRegisterError(err.message);
    }
  }

  return (
    <>
      <p>{registerError}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="youremail@example.com"
            {...register("email")}
          />
          <p> {errors.email?.message} </p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input type="text" placeholder="Mikey P" {...register("name")} />
          <p> {errors.name?.message} </p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="***********"
            {...register("password")}
          />
          <p> {errors.password?.message} </p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Email</label>
          <input
            type="password"
            placeholder="***********"
            {...register("passwordConfirmation")}
          />
          <p> {errors.passwordConfirmation?.message} </p>
        </div>

        <button type="submit"> Submit </button>
      </form>
    </>
  );
}

export default RegisterPage;
