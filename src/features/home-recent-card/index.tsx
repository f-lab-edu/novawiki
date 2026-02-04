
type HomeRecentCardProps = {
  index: number;
  doc: {
    title: string;
    time: string;
  };
};

export function HomeRecentCard({index, doc}: HomeRecentCardProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground w-5 text-center">
          {index + 1}
        </span>
        <span className="text-sm font-medium">{doc.title}</span>
      </div>
      <span className="text-xs text-muted-foreground">
        {doc.time}
      </span>
    </div>
  )
}