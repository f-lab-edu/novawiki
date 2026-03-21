import { LoginForm } from "@/features";

export default function Login() {
  return (
    <div className="w-full px-4 sm:px-0 flex flex-col items-center">
      <div className="font-semibold text-lg sm:text-xl mb-6!">
        <span>로그인</span>
      </div>
      <LoginForm />
    </div>
  );
}
