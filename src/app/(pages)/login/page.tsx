import { LoginForm } from "@/features";

export default function Login() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="scroll-m-20 font-extrabold text-xl !mb-4">로그인</h1>
      <LoginForm />
    </div>
  );
}
