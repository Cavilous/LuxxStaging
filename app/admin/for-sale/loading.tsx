export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-[#333] rounded w-48 mb-2"></div>
          <div className="h-4 bg-[#333] rounded w-64"></div>
        </div>
        <div className="h-10 bg-[#333] rounded w-32"></div>
      </div>
      <div className="h-96 bg-[#1a1a1a] rounded border border-[#333]"></div>
    </div>
  )
}
