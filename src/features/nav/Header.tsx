"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import { useUserStore } from "@/store/useUserStore";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, isLoading, clearUser } = useUserStore();

  const handleLogout = async () => {
    await logout();
    clearUser();
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex justify-center border-b">
      <div className="flex justify-between w-full lg:w-300 h-15">
        <div className="flex items-center">
          <div className="font-extrabold text-2xl tracking-tighter">
            <Link href="/">NOVAWIKI</Link>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex">
            <InputGroup>
              <InputGroupInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex gap-2">
            {isLoading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded" />
            ) : isAuthenticated ? (
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleLogout()}
              >
                로그아웃
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button className="cursor-pointer">로그인</Button>
                </Link>
                <Link href="/signup">
                  <Button className="cursor-pointer">회원가입</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
