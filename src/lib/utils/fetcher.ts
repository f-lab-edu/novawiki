export const fetcher = async (url: string, revalidate = 60) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    next: { revalidate },
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
};
