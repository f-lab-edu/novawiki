type HomeTitleProps = {
  title: string;
};

export function HomeTitle({ title }: HomeTitleProps) {
  return (
    <h2 className="text-lg sm:text-xl font-semibold mb-2! sm:mb-3!">{title}</h2>
  );
}
