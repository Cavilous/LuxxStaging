export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="h-8 bg-[#333] cut-corner skeleton-card w-32 mb-6"></div>
      </div>
      <div className="h-96 md:h-[600px] bg-[#333] skeleton-card mb-12"></div>
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-12 bg-[#333] cut-corner skeleton-card w-3/4 mb-4"></div>
            <div className="h-6 bg-[#333] cut-corner skeleton-card w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-[#333] cut-corner skeleton-card"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-96 bg-[#333] cut-corner skeleton-card"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
