export function MoreDetailLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="container-more pt-[calc(var(--site-header-height)+0.5rem)] pb-16 md:pb-24">
      {children}
    </div>
  );
}
