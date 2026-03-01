type HomeTitleProps = {
  title: string;
};

export function HomeTitle({ title }: HomeTitleProps) {
  return <h2 className="text-xl font-bold mb-4!">{title}</h2>;
}
