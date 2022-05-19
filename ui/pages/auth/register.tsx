import { useForm } from "react-hook-form";

function RegisterPage() {
  const { register } = useForm();

  return (
    <>
      <form>
        <input type="email" placeholder="youremail@example.com" />
      </form>
    </>
  );
}

export default RegisterPage;
