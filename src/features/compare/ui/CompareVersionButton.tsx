import { Button } from "@/components";

type CompareVersionButtonType = {
  version: number;
};

export function CompareVersionButton({ version }: CompareVersionButtonType) {
  return (
    <Button variant="outline" className="w-full cursor-pointer">
      v{version} 버전 보기
    </Button>
  );
}
