"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { profileQueryOptions } from "@/entities";
import { MyDeleteAccount } from "./ui/MyDeleteAccount";
import { MyGate } from "./ui/MyGate";
import { MyNickContainer } from "./ui/MyNickContainer";
import { MyPasswordContainer } from "./ui/MyPasswordContainer";
import { MyProfileImageContainer } from "./ui/MyProfileImageContainer";

interface MyViewProps {
  isOAuth: boolean;
}

export function MyView({ isOAuth }: MyViewProps) {
  const [verified, setVerified] = useState(isOAuth);
  const { data } = useQuery({ ...profileQueryOptions(), enabled: verified });
  const profile = data?.data;

  if (!verified) {
    return <MyGate onVerified={() => setVerified(true)} />;
  }

  if (!profile) return <>로그인 정보가 없습니다.</>;

  return (
    <div className="w-full sm:w-80 flex flex-col gap-12">
      {/* 프로필 사진 */}
      <MyProfileImageContainer avatarUrl={profile.avatar_url} />

      {/* 닉네임 */}
      <MyNickContainer currentNick={profile.nick} />
      {!isOAuth && <MyPasswordContainer />}

      {/* 계정 탈퇴 */}
      <MyDeleteAccount nick={profile.nick} />
    </div>
  );
}
