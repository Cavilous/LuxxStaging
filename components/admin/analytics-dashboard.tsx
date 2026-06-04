"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Phone, FileText, RefreshCw, ChevronLeft, ChevronRight, Calendar, BarChart3, TrendingUp } from "lucide-react"
import { format, subDays, parseISO, isValid } from "date-fns"
import { toZonedTime } from "date-fns-tz"

interface CallEvent {
  id: string
  phoneNumber: string
  pageUrl: string
  pageRoute: string | null
  deviceType: string | null
  userAgent: string | null
  referrer: string | null
  createdAt: string
}

interface FormEvent {
  id: string
  formType: string
  pageUrl: string
  pageRoute: string | null
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  deviceType: string | null
  metadata: {
    inventoryId?: string
    inventorySlug?: string
    inventoryTitle?: string
    inventoryCategory?: string
  } | null
  createdAt: string
}

interface DailyData {
  date: string
  count: number
}

interface FormTypeData {
  formType: string
  count: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const ET_TIMEZONE = "America/New_York"

function formatInET(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const etDate = toZonedTime(d, ET_TIMEZONE)
  return format(etDate, "MMM d, yyyy h:mm a") + " ET"
}

function formatDateOnly(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const etDate = toZonedTime(d, ET_TIMEZONE)
  return format(etDate, "MMM d, yyyy")
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("calls")
  const [startDate, setStartDate] = useState(() => format(subDays(new Date(), 30), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(() => format(new Date(), "yyyy-MM-dd"))
  
  const [callEvents, setCallEvents] = useState<CallEvent[]>([])
  const [callDailyData, setCallDailyData] = useState<DailyData[]>([])
  const [callPagination, setCallPagination] = useState<Pagination | null>(null)
  const [callPage, setCallPage] = useState(1)
  const [loadingCalls, setLoadingCalls] = useState(false)
  
  const [formEvents, setFormEvents] = useState<FormEvent[]>([])
  const [formDailyData, setFormDailyData] = useState<DailyData[]>([])
  const [formTypeData, setFormTypeData] = useState<FormTypeData[]>([])
  const [formPagination, setFormPagination] = useState<Pagination | null>(null)
  const [formPage, setFormPage] = useState(1)
  const [loadingForms, setLoadingForms] = useState(false)

  const fetchCallData = useCallback(async () => {
    setLoadingCalls(true)
    try {
      const [eventsRes, dailyRes] = await Promise.all([
        fetch(`/api/admin/analytics/calls?startDate=${startDate}&endDate=${endDate}&page=${callPage}&limit=20`),
        fetch(`/api/admin/analytics/calls?startDate=${startDate}&endDate=${endDate}&aggregation=daily`),
      ])
      
      if (eventsRes.ok) {
        const data = await eventsRes.json()
        setCallEvents(data.data || [])
        setCallPagination(data.pagination || null)
      }
      
      if (dailyRes.ok) {
        const data = await dailyRes.json()
        setCallDailyData(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch call data:", error)
    } finally {
      setLoadingCalls(false)
    }
  }, [startDate, endDate, callPage])

  const fetchFormData = useCallback(async () => {
    setLoadingForms(true)
    try {
      const [eventsRes, dailyRes, byTypeRes] = await Promise.all([
        fetch(`/api/admin/analytics/forms?startDate=${startDate}&endDate=${endDate}&page=${formPage}&limit=20`),
        fetch(`/api/admin/analytics/forms?startDate=${startDate}&endDate=${endDate}&aggregation=daily`),
        fetch(`/api/admin/analytics/forms?startDate=${startDate}&endDate=${endDate}&aggregation=byFormType`),
      ])
      
      if (eventsRes.ok) {
        const data = await eventsRes.json()
        setFormEvents(data.data || [])
        setFormPagination(data.pagination || null)
      }
      
      if (dailyRes.ok) {
        const data = await dailyRes.json()
        setFormDailyData(data.data || [])
      }
      
      if (byTypeRes.ok) {
        const data = await byTypeRes.json()
        setFormTypeData(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch form data:", error)
    } finally {
      setLoadingForms(false)
    }
  }, [startDate, endDate, formPage])

  useEffect(() => {
    if (activeTab === "calls") {
      fetchCallData()
    }
  }, [activeTab, fetchCallData])

  useEffect(() => {
    if (activeTab === "forms") {
      fetchFormData()
    }
  }, [activeTab, fetchFormData])

  const handleDateChange = () => {
    setCallPage(1)
    setFormPage(1)
  }

  const callTotal = callDailyData.reduce((sum, d) => sum + d.count, 0)
  const formTotal = formDailyData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end bg-[#1a1a1a] p-4 rounded-lg border border-[#444444]">
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-medium">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ECAC36]" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); handleDateChange(); }}
              className="pl-10 pr-3 py-2 bg-[#0f0f0f] border border-[#444444] rounded text-white text-sm focus:border-[#ECAC36] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-medium">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ECAC36]" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); handleDateChange(); }}
              className="pl-10 pr-3 py-2 bg-[#0f0f0f] border border-[#444444] rounded text-white text-sm focus:border-[#ECAC36] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { activeTab === "calls" ? fetchCallData() : fetchFormData(); }}
          className="border-[#ECAC36] text-[#ECAC36] hover:bg-[#ECAC36]/10 hover:text-[#ECAC36]"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1a1a1a] border border-[#444444] p-1">
          <TabsTrigger 
            value="calls" 
            className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white px-4 py-2"
          >
            <Phone className="h-4 w-4 mr-2" />
            Calls ({callTotal})
          </TabsTrigger>
          <TabsTrigger 
            value="forms" 
            className="data-[state=active]:bg-[#ECAC36] data-[state=active]:text-black data-[state=inactive]:text-gray-300 data-[state=inactive]:hover:text-white px-4 py-2"
          >
            <FileText className="h-4 w-4 mr-2" />
            Forms ({formTotal})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calls" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="bg-[#1a1a1a] border-[#444444]">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200 text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-[#ECAC36]" />
                  Total Calls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#ECAC36]">{callTotal}</div>
                <p className="text-gray-400 text-sm mt-1">
                  {formatDateOnly(startDate)} - {formatDateOnly(endDate)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a1a1a] border-[#444444] col-span-1 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200 text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#ECAC36]" />
                  Daily Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={callDailyData} />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a1a1a] border-[#444444]">
            <CardHeader className="border-b border-[#333333]">
              <CardTitle className="text-gray-200">Call Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {loadingCalls ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : callEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No call events in this date range</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#444444] bg-[#0f0f0f]">
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Date/Time (ET)</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Dialed Number</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Page</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Device</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Referrer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {callEvents.map((event) => (
                          <tr key={event.id} className="border-b border-[#333333] hover:bg-[#222222] transition-colors">
                            <td className="py-3 px-3 text-gray-300 whitespace-nowrap">
                              {formatInET(event.createdAt)}
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-[#ECAC36] font-medium">
                                {formatPhoneDisplay(event.phoneNumber)}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-300">
                              {event.pageRoute || event.pageUrl?.replace(/^https?:\/\/[^/]+/, "") || "-"}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                event.deviceType === "mobile" 
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                                  : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                              }`}>
                                {event.deviceType || "unknown"}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-400 truncate max-w-[200px]">
                              {event.referrer ? event.referrer.replace(/^https?:\/\//, "").split("/")[0] : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {callPagination && callPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333333]">
                      <span className="text-gray-400 text-sm">
                        Page {callPagination.page} of {callPagination.totalPages} ({callPagination.total} total)
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCallPage((p) => Math.max(1, p - 1))}
                          disabled={callPage === 1}
                          className="border-[#444444] text-gray-300 hover:bg-[#333333] disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCallPage((p) => Math.min(callPagination.totalPages, p + 1))}
                          disabled={callPage >= callPagination.totalPages}
                          className="border-[#444444] text-gray-300 hover:bg-[#333333] disabled:opacity-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="bg-[#1a1a1a] border-[#444444]">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200 text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#ECAC36]" />
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#ECAC36]">{formTotal}</div>
                <p className="text-gray-400 text-sm mt-1">
                  {formatDateOnly(startDate)} - {formatDateOnly(endDate)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a1a1a] border-[#444444] col-span-1 lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-200 text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#ECAC36]" />
                  Daily Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={formDailyData} />
              </CardContent>
            </Card>
          </div>

          {formTypeData.length > 0 && (
            <Card className="bg-[#1a1a1a] border-[#444444]">
              <CardHeader className="pb-2 border-b border-[#333333]">
                <CardTitle className="text-gray-200 text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#ECAC36]" />
                  Submissions by Form Type
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {formTypeData.map((item) => (
                    <div key={item.formType} className="bg-[#0f0f0f] p-3 rounded-lg border border-[#444444] hover:border-[#ECAC36]/50 transition-colors">
                      <div className="text-2xl font-bold text-[#ECAC36]">{item.count}</div>
                      <div className="text-xs text-gray-300 mt-1 truncate" title={item.formType}>
                        {formatFormType(item.formType)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#1a1a1a] border-[#444444]">
            <CardHeader className="border-b border-[#333333]">
              <CardTitle className="text-gray-200">Form Submissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {loadingForms ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : formEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No form submissions in this date range</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#444444] bg-[#0f0f0f]">
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Date/Time (ET)</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Form Type</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Customer</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Contact</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Page</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Inventory</th>
                          <th className="text-left py-3 px-3 text-gray-200 font-semibold">Device</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formEvents.map((event) => (
                          <tr key={event.id} className="border-b border-[#333333] hover:bg-[#222222] transition-colors">
                            <td className="py-3 px-3 text-gray-300 whitespace-nowrap">
                              {formatInET(event.createdAt)}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-[#ECAC36]/20 text-[#ECAC36] border border-[#ECAC36]/30">
                                {formatFormType(event.formType)}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-300">
                              {event.customerName || "-"}
                            </td>
                            <td className="py-3 px-3 text-gray-400 text-xs">
                              {event.customerEmail && <div className="text-gray-300">{event.customerEmail}</div>}
                              {event.customerPhone && <div>{event.customerPhone}</div>}
                              {!event.customerEmail && !event.customerPhone && "-"}
                            </td>
                            <td className="py-3 px-3 text-gray-400 max-w-[150px] truncate" title={event.pageRoute || undefined}>
                              {event.pageRoute || event.pageUrl?.replace(/^https?:\/\/[^/]+/, "") || "-"}
                            </td>
                            <td className="py-3 px-3">
                              {event.metadata?.inventoryTitle ? (
                                <div className="max-w-[180px]">
                                  <div className="text-gray-300 truncate text-xs" title={event.metadata.inventoryTitle}>
                                    {event.metadata.inventoryTitle}
                                  </div>
                                  {event.metadata.inventoryCategory && (
                                    <span className="text-xs text-gray-500 capitalize">
                                      {event.metadata.inventoryCategory}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                event.deviceType === "mobile" 
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                                  : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                              }`}>
                                {event.deviceType || "unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {formPagination && formPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#333333]">
                      <span className="text-gray-400 text-sm">
                        Page {formPagination.page} of {formPagination.totalPages} ({formPagination.total} total)
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFormPage((p) => Math.max(1, p - 1))}
                          disabled={formPage === 1}
                          className="border-[#444444] text-gray-300 hover:bg-[#333333] disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFormPage((p) => Math.min(formPagination.totalPages, p + 1))}
                          disabled={formPage >= formPagination.totalPages}
                          className="border-[#444444] text-gray-300 hover:bg-[#333333] disabled:opacity-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SimpleBarChart({ data }: { data: DailyData[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(item => {
      let dateStr = item.date
      if (dateStr && !dateStr.includes("T")) {
        dateStr = `${dateStr}T12:00:00`
      }
      const parsed = parseISO(dateStr)
      return {
        ...item,
        parsedDate: isValid(parsed) ? parsed : null,
        displayDate: isValid(parsed) ? format(parsed, "M/d") : item.date
      }
    }).filter(item => item.parsedDate !== null)
  }, [data])

  if (!mounted) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading chart...</div>
      </div>
    )
  }

  if (processedData.length === 0) {
    return (
      <div className="h-32 flex flex-col items-center justify-center bg-[#0f0f0f] rounded-lg border border-[#333333]">
        <BarChart3 className="h-8 w-8 text-gray-600 mb-2" />
        <div className="text-gray-500 text-sm">No data available for this period</div>
      </div>
    )
  }

  const maxCount = Math.max(...processedData.map((d) => d.count), 1)
  
  return (
    <div className="h-36 flex items-end gap-1 overflow-x-auto pb-8 pt-6 px-2 relative bg-[#0f0f0f] rounded-lg border border-[#333333]">
      {processedData.map((item, idx) => {
        const heightPercent = Math.max((item.count / maxCount) * 100, 4)
        return (
          <div 
            key={idx} 
            className="flex flex-col items-center min-w-[28px] flex-1 group relative"
          >
            <div
              className="w-full bg-gradient-to-t from-[#ECAC36] to-[#f5c65d] rounded-t transition-all hover:from-[#f5c65d] hover:to-[#ffe082] cursor-pointer shadow-sm"
              style={{ height: `${heightPercent}%`, minHeight: "4px" }}
            />
            <div className="absolute -bottom-7 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a1a] px-1 rounded">
              {item.displayDate}
            </div>
            <div className="absolute -top-5 text-xs text-[#ECAC36] font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a1a] px-1 rounded">
              {item.count}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatFormType(formType: string): string {
  return formType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
