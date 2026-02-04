import { SignUpForm } from "@/features";

export default function SignUp() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="scroll-m-20 font-extrabold text-xl mb-4!">회원가입</h1>
      <SignUpForm />
    </div>
  );
}
