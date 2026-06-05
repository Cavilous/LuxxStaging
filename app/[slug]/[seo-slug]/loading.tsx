export default function SeoPageLoading() {
  return (
    <div className="min-h-screen bg-black">
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="h-4 w-48 bg-gray-800 rounded animate-pulse mb-8" />
          <div className="h-12 w-2/3 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="h-6 w-1/2 bg-gray-800 rounded animate-pulse mb-8" />
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="fleet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-gray-800 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse" />
                  <div className="h-8 w-1/3 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
