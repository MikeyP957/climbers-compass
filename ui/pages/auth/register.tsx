import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";

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

function RegisterPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  function onSubmit(values: any) {
    console.log({ values });
  }

  return (
    <>
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
