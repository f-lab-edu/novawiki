"use client";

import { signUp } from "@/app/actions/auth";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { startTransition, useActionState, useEffect, useState } from "react";
import {
  validateNick,
  validatePassword,
  validatePasswordChk,
  validateUserid,
} from "./utils/validate";
import { Button } from "@/components";

export function SignUpForm() {
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

  // FormAcfion
  const [state, formAction] = useActionState(signUp, { error: null });

  useEffect(() => {
    console.log(state);
    // Toast UI 띄우기
  }, [state]);

  // 아이디
  const handleUseridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validateUserid(value);
    setUserid(value);
    setUseridError(message);
    setIsValidUserid(isValid);
  };

  // 비밀번호
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validatePassword(value);
    setPassword(value);
    setPasswordError(message);
    setIsValidPassword(isValid);

    // 비밀번호 입력 시 확인 검증도 함께 실행
    const [isValidChk, messageChk] = validatePasswordChk(value, passwordChk);
    setPasswordChkError(messageChk);
    setIsValidPasswordChk(isValidChk);
  };

  // 비밀번호 확인
  const handlePasswordChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validatePasswordChk(password, value);
    setPasswordChk(value);
    setPasswordChkError(message);
    setIsValidPasswordChk(isValid);
  };

  // 닉네임
  const handleNickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const [isValid, message] = validateNick(value);
    setNick(value);
    setNickError(message);
    setIsValidNick(isValid);
  };

  // 폼 저장
  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form action={formAction} className="w-100" onSubmit={handleSignUpSubmit}>
      <FieldGroup>
        <Field data-invalid={!!useridError}>
          <FieldLabel htmlFor="input-field-userid">아이디</FieldLabel>
          <Input
            id="input-field-userid"
            type="text"
            name="userid"
            value={userid}
            onChange={handleUseridChange}
            placeholder="Enter your ID"
            aria-invalid={!!useridError}
          />
          {isValidUserid ? (
            <></>
          ) : useridError ? (
            <FieldDescription className="text-red-500">
              {useridError}
            </FieldDescription>
          ) : (
            <FieldDescription>
              영어와 숫자를 조합해 5자 이상으로 입력해주세요.
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!passwordError}>
          <FieldLabel htmlFor="input-field-password">비밀번호</FieldLabel>
          <Input
            id="input-field-password"
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={password}
            onChange={handlePasswordChange}
            aria-invalid={!!passwordError}
          />
          {isValidPassword ? (
            <></>
          ) : passwordError ? (
            <FieldDescription className="text-red-500">
              {passwordError}
            </FieldDescription>
          ) : (
            <FieldDescription>
              영어, 숫자, 특수문자를 조합해 8자 이상으로 입력해주세요.
            </FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!passwordChkError}>
          <FieldLabel htmlFor="input-field-passwordChk">
            비밀번호 확인
          </FieldLabel>
          <Input
            id="input-field-passwordChk"
            type="password"
            name="passwordChk"
            placeholder="Enter your Password Again"
            value={passwordChk}
            onChange={handlePasswordChkChange}
            aria-invalid={!!passwordChkError}
          />
          {isValidPasswordChk ? (
            <></>
          ) : passwordChkError ? (
            <FieldDescription className="text-red-500">
              {passwordChkError}
            </FieldDescription>
          ) : (
            <FieldDescription>비밀번호를 다시 입력해주세요.</FieldDescription>
          )}
        </Field>
        <Field data-invalid={!!nickError}>
          <FieldLabel htmlFor="input-field-password">닉네임</FieldLabel>
          <Input
            id="input-field-password"
            type="text"
            name="nick"
            placeholder="Enter your Nickname"
            value={nick}
            onChange={handleNickChange}
            aria-invalid={!!nickError}
          />
          {isValidNick ? (
            <></>
          ) : nickError ? (
            <FieldDescription className="text-red-500">
              {nickError}
            </FieldDescription>
          ) : (
            <FieldDescription>
              특수문자를 제외하고 입력해주세요.
            </FieldDescription>
          )}
        </Field>
        <Button type="submit" className="w-full cursor-pointer">
          회원가입
        </Button>
      </FieldGroup>
    </form>
  );
}
