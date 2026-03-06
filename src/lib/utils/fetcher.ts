export const fetcher = async <T>(url: string, revalidate = 60): Promise<T> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
    next: { revalidate },
  });
  return res.json();
};
