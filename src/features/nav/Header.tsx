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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
    <header className="border-b">
      <div className="flex justify-center">
        <div className="flex justify-between w-full sm:w-300 h-15 px-4 sm:px-0">
          <div className="flex items-center">
            <div className="font-extrabold text-xl sm:text-2xl tracking-tighter">
              <Link href="/">NOVAWIKI</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            {/* 데스크탑 검색창 */}
            <div className="hidden sm:flex">
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
            {/* 모바일 검색 아이콘 */}
            <button
              type="button"
              className="flex sm:hidden cursor-pointer"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="검색"
            >
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex gap-2">
              {isLoading ? (
                <div className="w-20 h-9 bg-gray-200 animate-pulse rounded" />
              ) : isAuthenticated ? (
                <Button
                  variant="outline"
                  className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
                  onClick={() => handleLogout()}
                >
                  로그아웃
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 모바일 검색창 */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 py-2 border-t">
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              autoFocus
              className="text-sm"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
    </header>
  );
}
