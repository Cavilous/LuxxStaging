import 'server-only'
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

async function getGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

// Sheet names for different form types
export const SHEET_NAMES = {
  RENTAL_INQUIRIES: 'Rental Inquiries',
  BUY_SELL_LEADS: 'Buy-Sell Leads',
  INVESTOR_LEADS: 'Investor Leads',
  GENERAL_CONTACT: 'General Contact',
  FLEET_MANAGEMENT: 'Fleet Management',
  REPAIR_SERVICES: 'Repair Services',
} as const;

// Column headers for each sheet type
export const SHEET_HEADERS = {
  [SHEET_NAMES.RENTAL_INQUIRIES]: [
    'Timestamp', 'Name', 'Phone', 'Email', 'Item Title', 'Item Category', 
    'Start Date', 'End Date', 'Location', 'Message', 'Source'
  ],
  [SHEET_NAMES.BUY_SELL_LEADS]: [
    'Timestamp', 'Lead Type', 'Name', 'Phone', 'Email', 'Asset ID', 'Asset Title',
    'Asset Category', 'Brand', 'Model', 'Year', 'Condition', 'Purchase Type',
    'Target Price', 'Available Docs', 'Message', 'UTM Source', 'UTM Medium', 'UTM Campaign'
  ],
  [SHEET_NAMES.INVESTOR_LEADS]: [
    'Timestamp', 'Name', 'Phone', 'Email', 'Company', 'Interests', 
    'AUM Range', 'Message', 'UTM Source', 'UTM Medium', 'UTM Campaign'
  ],
  [SHEET_NAMES.GENERAL_CONTACT]: [
    'Timestamp', 'Name', 'Phone', 'Email', 'Service Interest', 'Message'
  ],
  [SHEET_NAMES.FLEET_MANAGEMENT]: [
    'Timestamp', 'Name', 'Email', 'Phone', 'Vehicle Count', 'Current Storage', 'Message'
  ],
  [SHEET_NAMES.REPAIR_SERVICES]: [
    'Timestamp', 'Request Type', 'Name', 'Phone', 'Email', 'VIN', 'Year', 'Make', 
    'Model', 'Trim', 'Mileage', 'Date of Loss', 'Damage Areas', 'Is Drivable', 
    'Airbag Deployed', 'Insurance Carrier', 'Claim Number', 'Deductible', 
    'Pickup Location', 'Need Enclosed Tow', 'Services Requested', 'Wrap Details', 
    'Tint Percent', 'Desired Date', 'Notes', 'Consent'
  ],
};

// Get the spreadsheet ID from environment variable
function getSpreadsheetId(): string {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SPREADSHEET_ID environment variable not set');
  }
  return spreadsheetId;
}

// Initialize a sheet with headers if it doesn't have data
async function ensureSheetHeaders(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
): Promise<void> {
  try {
    // Check if sheet has any data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${sheetName}'!A1:Z1`,
    });

    // If no data, add headers
    if (!response.data.values || response.data.values.length === 0) {
      const headers = SHEET_HEADERS[sheetName as keyof typeof SHEET_HEADERS];
      if (headers) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${sheetName}'!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
        console.log(`✅ Added headers to sheet: ${sheetName}`);
      }
    }
  } catch (error: any) {
    // Sheet might not exist, we'll handle that in appendToSheet
    if (error.code === 400 && error.message?.includes('Unable to parse range')) {
      console.log(`Sheet ${sheetName} might not exist yet`);
    } else {
      console.error(`Error checking headers for ${sheetName}:`, error.message);
    }
  }
}

// Create a sheet if it doesn't exist
async function ensureSheetExists(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
): Promise<void> {
  try {
    // Get all sheets in the spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheets = spreadsheet.data.sheets?.map(
      (s: any) => s.properties?.title
    ) || [];

    if (!existingSheets.includes(sheetName)) {
      // Create the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
      console.log(`✅ Created sheet: ${sheetName}`);
      
      // Add headers to new sheet
      const headers = SHEET_HEADERS[sheetName as keyof typeof SHEET_HEADERS];
      if (headers) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${sheetName}'!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }
    }
  } catch (error: any) {
    console.error(`Error ensuring sheet exists: ${sheetName}:`, error.message);
    throw error;
  }
}

// Append a row to a specific sheet
export async function appendToSheet(
  sheetName: string,
  rowData: (string | number | boolean | null | undefined)[]
): Promise<boolean> {
  try {
    const sheets = await getGoogleSheetClient();
    const spreadsheetId = getSpreadsheetId();

    // Ensure the sheet exists
    await ensureSheetExists(sheets, spreadsheetId, sheetName);
    
    // Ensure headers exist even for pre-existing sheets
    await ensureSheetHeaders(sheets, spreadsheetId, sheetName);

    // Add timestamp as first column
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = [timestamp, ...rowData.map(v => v?.toString() ?? '')];

    // Append the row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetName}'!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [dataWithTimestamp],
      },
    });

    console.log(`✅ Appended row to ${sheetName}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error appending to sheet ${sheetName}:`, error.message);
    return false;
  }
}

// Helper functions for specific form types
export async function logRentalInquiry(data: {
  name: string;
  phone: string;
  email?: string;
  itemTitle?: string;
  itemCategory?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  message?: string;
  source?: string;
}): Promise<boolean> {
  return appendToSheet(SHEET_NAMES.RENTAL_INQUIRIES, [
    data.name,
    data.phone,
    data.email,
    data.itemTitle,
    data.itemCategory,
    data.startDate,
    data.endDate,
    data.location,
    data.message,
    data.source,
  ]);
}

export async function logBuySellLead(data: {
  leadType: 'buyer' | 'seller';
  name: string;
  phone: string;
  email: string;
  assetId?: string;
  assetTitle?: string;
  assetCategory?: string;
  brand?: string;
  model?: string;
  year?: string;
  condition?: string;
  purchaseType?: string;
  targetPrice?: string;
  availableDocs?: string[];
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): Promise<boolean> {
  return appendToSheet(SHEET_NAMES.BUY_SELL_LEADS, [
    data.leadType,
    data.name,
    data.phone,
    data.email,
    data.assetId,
    data.assetTitle,
    data.assetCategory,
    data.brand,
    data.model,
    data.year,
    data.condition,
    data.purchaseType,
    data.targetPrice,
    data.availableDocs?.join(', '),
    data.message,
    data.utmSource,
    data.utmMedium,
    data.utmCampaign,
  ]);
}

export async function logInvestorLead(data: {
  name: string;
  phone: string;
  email: string;
  company?: string;
  interests: string[];
  aumRange?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): Promise<boolean> {
  return appendToSheet(SHEET_NAMES.INVESTOR_LEADS, [
    data.name,
    data.phone,
    data.email,
    data.company,
    data.interests.join(', '),
    data.aumRange,
    data.message,
    data.utmSource,
    data.utmMedium,
    data.utmCampaign,
  ]);
}

export async function logGeneralContact(data: {
  name: string;
  phone: string;
  email: string;
  serviceInterest?: string;
  message?: string;
}): Promise<boolean> {
  return appendToSheet(SHEET_NAMES.GENERAL_CONTACT, [
    data.name,
    data.phone,
    data.email,
    data.serviceInterest,
    data.message,
  ]);
}

export async function logFleetManagement(data: {
  name: string;
  email: string;
  phone: string;
  vehicleCount?: string;
  currentStorage?: string;
  message?: string;
}): Promise<boolean> {
  return appendToSheet(SHEET_NAMES.FLEET_MANAGEMENT, [
    data.name,
    data.email,
    data.phone,
    data.vehicleCount,
    data.currentStorage,
    data.message,
  ]);
}

export async function logRepairService(data: {
  requestType: 'insurance' | 'customization';
  name: string;
  phone: string;
  email: string;
  vin?: string;
  year?: string;
  make?: string;
  model?: string;
  trim?: string;
  mileage?: string;
  dateOfLoss?: string;
  damageAreas?: string[];
  isDrivable?: string;
  airbagDeployed?: string;
  carrier?: string;
  claimNumber?: string;
  deductible?: string;
  pickupLocation?: string;
  needEnclosedTow?: string;
  servicesRequested?: string;
  wrapDetails?: string;
  tintPercent?: string;
  desiredDate?: string;
  notes?: string;
  consent?: boolean;
}): Promise<boolean> {
  return appendToSheet(SHEET_NAMES.REPAIR_SERVICES, [
    data.requestType,
    data.name,
    data.phone,
    data.email,
    data.vin,
    data.year,
    data.make,
    data.model,
    data.trim,
    data.mileage,
    data.dateOfLoss,
    data.damageAreas?.join(', '),
    data.isDrivable,
    data.airbagDeployed,
    data.carrier,
    data.claimNumber,
    data.deductible,
    data.pickupLocation,
    data.needEnclosedTow,
    data.servicesRequested,
    data.wrapDetails,
    data.tintPercent,
    data.desiredDate,
    data.notes,
    data.consent?.toString(),
  ]);
}
