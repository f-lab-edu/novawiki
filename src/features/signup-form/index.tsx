"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/app/actions/auth";
import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  Input,
} from "@/components";
import { simpleMessageToast } from "@/lib/utils/common";
import { useUserStore } from "@/store/useUserStore";
import {
  validateNick,
  validatePassword,
  validatePasswordChk,
  validateUserid,
} from "./utils/validate";

const ERROR_TITLE = "회원가입 오류";

export function SignUpForm() {
  const [step, setStep] = useState<number>(1);

  // 아이디
  const [userid, setUserid] = useState<string>("");
  const [useridError, setUseridError] = useState<string>("");
  const [isValidUserid, setIsValidUserid] = useState<boolean>(false);
  // 비밀번호
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  // 비밀번호 확인
  const [passwordChk, setPasswordChk] = useState<string>("");
  const [passwordChkError, setPasswordChkError] = useState<string>("");
  const [isValidPasswordChk, setIsValidPasswordChk] = useState<boolean>(false);
  // 닉네임
  const [nick, setNick] = useState<string>("");
  const [nickError, setNickError] = useState<string>("");
  const [isValidNick, setIsValidNick] = useState<boolean>(false);

  const router = useRouter();
  const { setUser } = useUserStore();

  const handleUseridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validateUserid(value);
    setUserid(value);
    setUseridError(message);
    setIsValidUserid(isValid);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validatePassword(value);
    setPassword(value);
    setPasswordError(message);
    setIsValidPassword(isValid);
    const [isValidChk, messageChk] = validatePasswordChk(value, passwordChk);
    setPasswordChkError(messageChk);
    setIsValidPasswordChk(isValidChk);
  };

  const handlePasswordChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validatePasswordChk(password, value);
    setPasswordChk(value);
    setPasswordChkError(message);
    setIsValidPasswordChk(isValid);
  };

  const handleNickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validateNick(value);
    setNick(value);
    setNickError(message);
    setIsValidNick(isValid);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleAction = async (formData: FormData) => {
    if (step === 1) {
      if (!isValidUserid) {
        simpleMessageToast(ERROR_TITLE, "유효하지 않은 아이디입니다.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!isValidPassword || !isValidPasswordChk) {
        simpleMessageToast(ERROR_TITLE, "비밀번호를 올바르게 입력해 주세요.");
        return;
      }
      setStep(3);
      return;
    }

    if (!isValidNick) {
      simpleMessageToast(ERROR_TITLE, "유효하지 않은 닉네임입니다.");
      return;
    }
    const result = await signUp(formData);
    if (result.error) {
      simpleMessageToast(ERROR_TITLE, result.error);
      return;
    }
    if (result.success && result.id) {
      setUser({ id: result.id });
      router.push("/");
    }
  };

  return (
    <form action={handleAction} className="w-full sm:w-80">
      <input type="hidden" name="userid" value={userid} />
      <input type="hidden" name="password" value={password} />
      <input type="hidden" name="passwordChk" value={passwordChk} />

      <FieldGroup className="gap-4">
        <div>
          {step === 1 && (
            <div>
              <Field data-invalid={!!useridError}>
                <Input
                  id="input-field-userid"
                  type="text"
                  name="userid-display"
                  value={userid}
                  onChange={handleUseridChange}
                  placeholder="아이디"
                  aria-invalid={!!useridError}
                  autoFocus
                  className="text-sm"
                />
                {isValidUserid ? null : useridError ? (
                  <FieldDescription className="text-red-500">
                    {useridError}
                  </FieldDescription>
                ) : (
                  <FieldDescription className="text-gray-400">
                    영어와 숫자를 조합하여 5자 이상으로 입력해 주세요.
                  </FieldDescription>
                )}
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Field data-invalid={!!passwordError}>
                <Input
                  id="input-field-password"
                  type="password"
                  name="password-display"
                  placeholder="비밀번호"
                  value={password}
                  onChange={handlePasswordChange}
                  aria-invalid={!!passwordError}
                  autoFocus
                  className="text-sm"
                />
                {isValidPassword ? null : passwordError ? (
                  <FieldDescription className="text-red-500">
                    {passwordError}
                  </FieldDescription>
                ) : (
                  <FieldDescription className="text-gray-400">
                    영어, 숫자, 특수문자를 조합하여 8자 이상으로 입력해 주세요.
                  </FieldDescription>
                )}
              </Field>
              <Field data-invalid={!!passwordChkError}>
                <Input
                  id="input-field-passwordChk"
                  type="password"
                  name="passwordChk-display"
                  placeholder="비밀번호 확인"
                  value={passwordChk}
                  onChange={handlePasswordChkChange}
                  aria-invalid={!!passwordChkError}
                  className="text-sm"
                />
                {isValidPasswordChk ? null : passwordChkError ? (
                  <FieldDescription className="text-red-500">
                    {passwordChkError}
                  </FieldDescription>
                ) : (
                  <FieldDescription className="text-gray-400">
                    비밀번호를 다시 입력해 주세요.
                  </FieldDescription>
                )}
              </Field>
            </div>
          )}

          {step === 3 && (
            <div>
              <Field data-invalid={!!nickError}>
                <Input
                  id="input-field-nick"
                  type="text"
                  name="nick"
                  placeholder="닉네임"
                  value={nick}
                  onChange={handleNickChange}
                  aria-invalid={!!nickError}
                  autoFocus
                  className="text-sm"
                />
                {isValidNick ? null : nickError ? (
                  <FieldDescription className="text-red-500">
                    {nickError}
                  </FieldDescription>
                ) : (
                  <FieldDescription className="text-gray-400">
                    특수문자를 제외하고 입력해 주세요.
                  </FieldDescription>
                )}
              </Field>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-2!">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={handlePrev}
            >
              이전
            </Button>
          )}
          {step < 3 ? (
            <Button type="submit" className="flex-1 cursor-pointer">
              다음
            </Button>
          ) : (
            <Button type="submit" className="flex-1 cursor-pointer">
              회원가입
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
