export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="h-12 w-48 mx-auto bg-gray-800/50 rounded animate-pulse mb-4" />
            <div className="h-6 w-80 mx-auto bg-gray-800/50 rounded animate-pulse" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-800/50 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-1/4" />
                  <div className="h-6 bg-gray-800/50 rounded animate-pulse" />
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse" />
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
