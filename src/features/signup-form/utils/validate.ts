/**
 * 아이디 검증 함수
 * @param userid 아이디
 * @returns
 */
export function validateUserid(userid: string): [boolean, string] {
  // 영어, 숫자 입력 검증 정규식
  const USERID_REGEX = /^[a-zA-Z0-9]+$/;

  // 5자 이상인지 확인
  if (userid.length < 5) {
    const isValid = false;
    const message = "아이디는 5자 이상이어야 합니다.";
    return [isValid, message];
  }

  // 영어 + 숫자 조합 검증
  if (!USERID_REGEX.test(userid)) {
    const isValid = false;
    const message = "아이디는 영어와 숫자 조합으로만 입력할 수 있습니다.";
    return [isValid, message];
  }

  // 성공
  return [true, ""];
}

/**
 * 비밀번호 검증 함수
 * @param password 비밀번호
 * @returns
 */
export function validatePassword(password: string): [boolean, string] {
  if (password.length < 8) {
    const isValid = false;
    const message = "비밀번호는 8자 이상이어야 합니다.";
    return [isValid, message];
  }

  // 영어 소문자, 숫자, 특수문자 포함 필수 검증 정규식
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

  // 영어, 숫자, 특수문자 외 다른 문자 포함되어있는 지 검증
  const IMP_PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

  if (!PASSWORD_REGEX.test(password)) {
    const isValid = false;
    const message = "영어 소문자, 숫자, 특수문자가 반드시 포함되어야 합니다.";
    return [isValid, message];
  }

  if (!IMP_PASSWORD_REGEX.test(password)) {
    const isValid = false;
    const message = "영어, 숫자, 특수문자만 사용할 수 있습니다.";
    return [isValid, message];
  }

  return [true, ""];
}

/**
 * 비밀번호 일치 검증 함수
 * @param password 비밀번호
 * @param passwordChk 비밀번호 확인
 * @returns
 */
export function validatePasswordChk(
  password: string,
  passwordChk: string,
): [boolean, string] {
  if (password !== passwordChk) {
    const isValid = false;
    const message = "비밀번호가 일치하지 않습니다.";
    return [isValid, message];
  }

  return [true, ""];
}

/**
 * 닉네임 검증 함수
 * @param nick 닉네임
 * @returns
 */
export function validateNick(nick: string): [boolean, string] {
  if (nick.length < 3) {
    const isValid = false;
    const message = "닉네임은 3자 이상이어야 합니다.";
    return [isValid, message];
  }

  const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]+$/;

  if (!NICKNAME_REGEX.test(nick)) {
    const isValid = false;
    const message = "닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.";
    return [isValid, message];
  }

  return [true, ""];
}
