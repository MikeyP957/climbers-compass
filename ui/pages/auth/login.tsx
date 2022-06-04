import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, TypeOf } from "zod";

const createSessionSchema = object({
  email: string().nonempty({ message: "Email is required" }),
  password: string().nonempty({ message: "Password is required" }),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>;

function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  async function onSubmit(values: CreateSessionInput) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        values,
        {withCredentials: true}
      );
      // after user created redirect to home
      router.push("/");
    } catch (err: any) {
      setLoginError(err.message);
    }
  }

  return (
    <>
      <p>{loginError}</p>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="***********"
            {...register("password")}
          />
          <p> {errors.password?.message} </p>
        </div>

        <button type="submit"> Submit </button>
      </form>
    </>
  );
}

export default LoginPage;
