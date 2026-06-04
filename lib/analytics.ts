// Analytics utility for tracking buy-sell events
interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
}

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  // Send to analytics provider (Google Analytics 4)
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", event, properties)
  }
}

// Buy-sell specific tracking events
export const analytics = {
  // Asset viewing
  trackAssetView: (assetId: string, assetTitle: string, category: string) => {
    trackEvent("forsale.view", {
      asset_id: assetId,
      asset_title: assetTitle,
      asset_category: category,
    })
  },

  // Inquiry events
  trackInquiryStarted: (assetId: string, assetTitle: string) => {
    trackEvent("forsale.inquiry_started", {
      asset_id: assetId,
      asset_title: assetTitle,
    })
  },

  trackInquirySubmitted: (assetId: string, assetTitle: string, purchaseType: string) => {
    trackEvent("forsale.inquiry_submitted", {
      asset_id: assetId,
      asset_title: assetTitle,
      purchase_type: purchaseType,
    })
  },

  // Sell intake
  trackSellIntakeSubmitted: (assetCategory: string, brand?: string, model?: string) => {
    trackEvent("sell.intake_submitted", {
      asset_category: assetCategory,
      brand,
      model,
    })
  },

  // Investor interest
  trackInvestorInterestSubmitted: (interests: string[], aumRange?: string) => {
    trackEvent("investor.interest_submitted", {
      interests,
      aum_range: aumRange,
    })
  },

  // ROI calculator
  trackROISimulated: (purchasePrice: number, estimatedReturn: number, utilization: number) => {
    trackEvent("roi.simulated", {
      purchase_price: purchasePrice,
      estimated_return: estimatedReturn,
      utilization_percent: utilization,
    })
  },

  // <CHANGE> Added repair-specific tracking events
  // Repair page viewing
  trackRepairView: () => {
    trackEvent("repair.view", {
      page: "/repair",
      timestamp: new Date().toISOString(),
    })
  },

  // Insurance intake events
  trackInsuranceIntakeSubmitted: (vehicleBrand: string, vehicleModel: string, carrier: string, damageAreas: string[]) => {
    trackEvent("repair.insurance_intake_submitted", {
      vehicle_brand: vehicleBrand,
      vehicle_model: vehicleModel,
      insurance_carrier: carrier,
      damage_areas: damageAreas,
      priority: ["Ferrari", "Lamborghini", "McLaren", "Bugatti", "Rolls-Royce", "Bentley"].includes(vehicleBrand),
    })
  },

  // Custom quote events
  trackCustomQuoteSubmitted: (vehicleBrand: string, vehicleModel: string, services: string[]) => {
    trackEvent("repair.custom_quote_submitted", {
      vehicle_brand: vehicleBrand,
      vehicle_model: vehicleModel,
      services_requested: services,
      service_count: services.length,
    })
  },
}
