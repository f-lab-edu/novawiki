import { SignUpForm } from "@/features";

export default function SignUp() {
  return (
    <div className="w-full px-4 sm:px-0 flex flex-col items-center">
      <div className="font-semibold text-lg sm:text-xl mb-6!">
        <span>회원가입</span>
      </div>
      <SignUpForm />
    </div>
  );
}
