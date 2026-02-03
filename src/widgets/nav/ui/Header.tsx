import { Button } from "@/components";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/shadcn/input-group";
import Link from "next/link";
import { SearchIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="flex justify-center">
      <div className="flex justify-between w-full lg:w-[1200px] h-[60px]">
        <div className="flex items-center">
          <div className="font-extrabold text-2xl tracking-tighter">
            <Link href="/">
              NOVAWIKI
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex">
            <InputGroup>
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex gap-2">
            <Link href="/login">
              <Button className="cursor-pointer">로그인</Button>
            </Link>
            <Link href="/signup">
              <Button className="cursor-pointer">회원가입</Button>
            </Link>
            <Button variant="outline" className="cursor-pointer">로그아웃</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
