export function FeaturedProductsSkeleton() {
  return (
    <section className="py-12" aria-label="Ładowanie wyróżnionych produktów">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl overflow-hidden animate-pulse bg-white/40">
              <div className="relative w-full h-80 bg-secondary/20" />
              <div className="p-6 space-y-4">
                <div className="mx-auto h-6 bg-primary/10 rounded w-3/4" />
                <div className="mx-auto h-4 bg-primary/10 rounded w-1/2" />
                <div className="mx-auto h-7 bg-primary/10 rounded w-1/3" />
                <div className="mx-auto h-8 bg-primary/10 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
