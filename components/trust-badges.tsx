import { Shield, CheckCircle, Clock, Star } from "lucide-react"

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <div className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-black/30 border border-[#ECAC36]/20 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-[#ECAC36]/20 flex items-center justify-center">
          <Shield className="h-5 w-5 text-[#ECAC36]" />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-white">Verified</p>
          <p className="text-[10px] sm:text-xs text-gray-400">by Luxx</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-black/30 border border-[#ECAC36]/20 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-[#ECAC36]/20 flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-[#ECAC36]" />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-white">Premium</p>
          <p className="text-[10px] sm:text-xs text-gray-400">Selection</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-black/30 border border-[#ECAC36]/20 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-[#ECAC36]/20 flex items-center justify-center">
          <Clock className="h-5 w-5 text-[#ECAC36]" />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-white">1 Hour</p>
          <p className="text-[10px] sm:text-xs text-gray-400">Response</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-black/30 border border-[#ECAC36]/20 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-[#ECAC36]/20 flex items-center justify-center">
          <Star className="h-5 w-5 text-[#ECAC36]" />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm font-semibold text-white">5 Star</p>
          <p className="text-[10px] sm:text-xs text-gray-400">Service</p>
        </div>
      </div>
    </div>
  )
}
