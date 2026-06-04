export function InventorySkeleton() {
  return (
    <div className="bg-[#0A0A0A] cut-corner-card overflow-hidden animate-pulse">
      <div className="relative aspect-[3/2] bg-gray-800"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-800 rounded w-3/4"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        <div className="h-5 bg-gray-800 rounded w-1/3 mt-2"></div>
        <div className="h-4 bg-gray-800 rounded w-full mt-2"></div>
        <div className="h-10 bg-gray-800 rounded w-full mt-4"></div>
      </div>
    </div>
  )
}

export function InventoryRowSkeleton({ title }: { title: string }) {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 relative">
          <div className="flex items-center mb-4">
            <div
              className="w-2 h-16 bg-gradient-to-b from-[#ECAC36] to-[#e6c766] mr-6 shadow-lg"
              style={{ transform: "skewY(-8deg)" }}
            />
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white tracking-tight mb-2">
                {title}
              </h2>
              <div className="h-4 bg-gray-800 rounded w-96 max-w-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[320px]">
              <InventorySkeleton />
            </div>
          ))}
        </div>

        {/* Section Divider */}
        <div className="mt-20 flex justify-center">
          <div
            className="w-48 h-1 bg-gradient-to-r from-transparent via-[#ECAC36] to-transparent relative"
            style={{ transform: "skewX(-6deg)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ECAC36]/30 to-transparent blur-sm" />
          </div>
        </div>
      </div>
    </section>
  )
}
