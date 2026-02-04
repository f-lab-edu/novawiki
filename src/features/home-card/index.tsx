type HomeCardProps = {
  index: number;
  doc: {
    title: string;
    preview: string;
    author: string;
    time: string;
  };
};

export function HomeCard({ index, doc }: HomeCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
      <span className="text-2xl font-bold text-muted-foreground/40 w-8 text-center shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base">{doc.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {doc.preview}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{doc.author}</span>
          <span>·</span>
          <span>{doc.time}</span>
        </div>
      </div>
    </div>
  );
}
