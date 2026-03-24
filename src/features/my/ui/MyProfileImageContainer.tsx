"use client";

import { useQueryClient } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { updateAvatar } from "@/app/actions/user";
import { uploadAvatar } from "@/lib/storage/uploadImage";
import { simpleMessageToast } from "@/lib/utils/common";

interface MyProfileImageContainerProps {
  avatarUrl: string | null;
}

export function MyProfileImageContainer({
  avatarUrl,
}: MyProfileImageContainerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadAvatar(file);
      const result = await updateAvatar(url);
      if (result.error) {
        simpleMessageToast("업로드 오류", result.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      simpleMessageToast("업로드 완료", "프로필 사진이 변경되었습니다.");
    } catch {
      simpleMessageToast("업로드 오류", "이미지 업로드에 실패했습니다.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
        aria-label="프로필 사진 변경"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="프로필 사진"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-10 h-10 text-gray-400" />
          </div>
        )}
      </button>
      <p className="text-xs text-muted-foreground">클릭하여 사진 변경</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
