export function MoreDetailLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="container-more mx-auto w-full px-5 md:px-8 lg:px-12 xl:px-14 pt-[calc(var(--site-header-height)+0.5rem)] pb-16 md:pb-24">
      {children}
    </div>
  );
}
