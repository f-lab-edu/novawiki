export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex justify-center min-h-screen pt-10! pb-10!">
      {children}
    </main>
  );
}
