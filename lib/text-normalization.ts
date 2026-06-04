const ACRONYMS = new Set([
  "BMW", "AMG", "SVJ", "SV", "GT", "GTR", "GTS", "GTC", "RS", "RSQ", 
  "R8", "F8", "SF90", "V12", "V10", "V8", "V6", "EV", "SRT", "SVR",
  "M", "X", "XR", "4x4", "4WD", "AWD", "RWD", "FWD",
  "S", "SE", "SEL", "SL", "SLS", "SLR", "SLC", "AMG", 
  "GLE", "GLS", "GLA", "GLB", "GLC", "CLA", "CLS", "EQS", "EQE",
  "Q", "Q3", "Q5", "Q7", "Q8", "A1", "A3", "A4", "A5", "A6", "A7", "A8",
  "TT", "TTS", "TTRS", "R8", "E-Tron", "e-tron",
  "M2", "M3", "M4", "M5", "M6", "M8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "X8",
  "i3", "i4", "i5", "i7", "i8", "iX", 
  "LT", "ZR1", "Z06", "ZL1", "SS", "ZR", "LT1", "LT4", "LT5",
  "LP", "LP580", "LP610", "LP640", "LP700", "LP750", "LP770", "EVO",
  "P1", "P1", "LM", "720S", "765LT", "570S", "600LT", "650S", "675LT",
  "F1", "F12", "F40", "F50", "F430", "F355", "F458", "FF", 
  "812", "488", "458", "296", "Roma", "Portofino", "Purosangue",
  "911", "918", "959", "992", "991", "997", "996", "964", "930",
  "GT2", "GT3", "GT4", "GTE", "PDK", "PSE", "PCCB",
  "DBX", "DB9", "DB11", "DBS", "V8V", "VH", "Vantage",
  "SVR", "SVJ", "STO", "Performante", "Stradale", "Pista", "Scuderia",
  "PHEV", "BEV", "HEV", "ICE", "MPG", "HP", "KW", "NM", "LB-FT",
  "xDrive", "sDrive", "quattro", "4Matic", "4MATIC",
  "VIP", "SUV", "MPV", "SAV", "SAC",
  "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII",
  "USA", "UK", "EU",
  "G63", "G65", "G500", "G550", "G55", "G500", "G320",
  "40i", "50i", "M50i", "M60i", "30i", "35i", "45i", "M40i",
]);

const BRAND_MAPPINGS: Record<string, string> = {
  "mclaren": "McLaren",
  "MCLAREN": "McLaren",
  "rolls-royce": "Rolls-Royce",
  "ROLLS-ROYCE": "Rolls-Royce",
  "rolls royce": "Rolls-Royce",
  "ROLLS ROYCE": "Rolls-Royce",
  "rollsroyce": "Rolls-Royce",
  "ROLLSROYCE": "Rolls-Royce",
  "mercedes-benz": "Mercedes-Benz",
  "MERCEDES-BENZ": "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
  "MERCEDES BENZ": "Mercedes-Benz",
  "mercedesbenz": "Mercedes-Benz",
  "MERCEDESBENZ": "Mercedes-Benz",
  "land rover": "Land Rover",
  "LAND ROVER": "Land Rover",
  "landrover": "Land Rover",
  "LANDROVER": "Land Rover",
  "aston martin": "Aston Martin",
  "ASTON MARTIN": "Aston Martin",
  "astonmartin": "Aston Martin",
  "ASTONMARTIN": "Aston Martin",
  "range rover": "Range Rover",
  "RANGE ROVER": "Range Rover",
  "rangerover": "Range Rover",
  "RANGEROVER": "Range Rover",
  "lamborghini": "Lamborghini",
  "LAMBORGHINI": "Lamborghini",
  "ferrari": "Ferrari",
  "FERRARI": "Ferrari",
  "porsche": "Porsche",
  "PORSCHE": "Porsche",
  "bentley": "Bentley",
  "BENTLEY": "Bentley",
  "maserati": "Maserati",
  "MASERATI": "Maserati",
  "bugatti": "Bugatti",
  "BUGATTI": "Bugatti",
  "pagani": "Pagani",
  "PAGANI": "Pagani",
  "koenigsegg": "Koenigsegg",
  "KOENIGSEGG": "Koenigsegg",
  "rimac": "Rimac",
  "RIMAC": "Rimac",
  "maybach": "Maybach",
  "MAYBACH": "Maybach",
  "brabus": "Brabus",
  "BRABUS": "Brabus",
  "alpina": "Alpina",
  "ALPINA": "Alpina",
  "lexus": "Lexus",
  "LEXUS": "Lexus",
  "infiniti": "Infiniti",
  "INFINITI": "Infiniti",
  "genesis": "Genesis",
  "GENESIS": "Genesis",
  "cadillac": "Cadillac",
  "CADILLAC": "Cadillac",
  "corvette": "Corvette",
  "CORVETTE": "Corvette",
  "chevrolet": "Chevrolet",
  "CHEVROLET": "Chevrolet",
  "ford": "Ford",
  "FORD": "Ford",
  "mustang": "Mustang",
  "MUSTANG": "Mustang",
  "tesla": "Tesla",
  "TESLA": "Tesla",
  "lucid": "Lucid",
  "LUCID": "Lucid",
  "rivian": "Rivian",
  "RIVIAN": "Rivian",
  "polaris": "Polaris",
  "POLARIS": "Polaris",
  "sea-doo": "Sea-Doo",
  "SEA-DOO": "Sea-Doo",
  "sea doo": "Sea-Doo",
  "SEA DOO": "Sea-Doo",
  "yamaha": "Yamaha",
  "YAMAHA": "Yamaha",
  "kawasaki": "Kawasaki",
  "KAWASAKI": "Kawasaki",
  "ducati": "Ducati",
  "DUCATI": "Ducati",
  "harley-davidson": "Harley-Davidson",
  "HARLEY-DAVIDSON": "Harley-Davidson",
  "harley davidson": "Harley-Davidson",
  "HARLEY DAVIDSON": "Harley-Davidson",
};

const MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", 
  "of", "on", "or", "so", "the", "to", "up", "yet", "with"
]);

const MODEL_MAPPINGS: Record<string, string> = {
  "cullinan": "Cullinan",
  "CULLINAN": "Cullinan",
  "urus": "Urus",
  "URUS": "Urus",
  "huracan": "Huracan",
  "HURACAN": "Huracan",
  "huracán": "Huracán",
  "HURACÁN": "Huracán",
  "aventador": "Aventador",
  "AVENTADOR": "Aventador",
  "revuelto": "Revuelto",
  "REVUELTO": "Revuelto",
  "countach": "Countach",
  "COUNTACH": "Countach",
  "gallardo": "Gallardo",
  "GALLARDO": "Gallardo",
  "murcielago": "Murcielago",
  "MURCIELAGO": "Murcielago",
  "diablo": "Diablo",
  "DIABLO": "Diablo",
  "chiron": "Chiron",
  "CHIRON": "Chiron",
  "veyron": "Veyron",
  "VEYRON": "Veyron",
  "phantom": "Phantom",
  "PHANTOM": "Phantom",
  "ghost": "Ghost",
  "GHOST": "Ghost",
  "wraith": "Wraith",
  "WRAITH": "Wraith",
  "dawn": "Dawn",
  "DAWN": "Dawn",
  "spectre": "Spectre",
  "SPECTRE": "Spectre",
  "continental": "Continental",
  "CONTINENTAL": "Continental",
  "flying spur": "Flying Spur",
  "FLYING SPUR": "Flying Spur",
  "flyingspur": "Flying Spur",
  "bentayga": "Bentayga",
  "BENTAYGA": "Bentayga",
  "ghibli": "Ghibli",
  "GHIBLI": "Ghibli",
  "levante": "Levante",
  "LEVANTE": "Levante",
  "quattroporte": "Quattroporte",
  "QUATTROPORTE": "Quattroporte",
  "granturismo": "GranTurismo",
  "GRANTURISMO": "GranTurismo",
  "gran turismo": "GranTurismo",
  "GRAN TURISMO": "GranTurismo",
  "cayenne": "Cayenne",
  "CAYENNE": "Cayenne",
  "panamera": "Panamera",
  "PANAMERA": "Panamera",
  "taycan": "Taycan",
  "TAYCAN": "Taycan",
  "macan": "Macan",
  "MACAN": "Macan",
  "cayman": "Cayman",
  "CAYMAN": "Cayman",
  "boxster": "Boxster",
  "BOXSTER": "Boxster",
  "carrera": "Carrera",
  "CARRERA": "Carrera",
  "turbo": "Turbo",
  "TURBO": "Turbo",
  "defender": "Defender",
  "DEFENDER": "Defender",
  "escalade": "Escalade",
  "ESCALADE": "Escalade",
  "navigator": "Navigator",
  "NAVIGATOR": "Navigator",
  "cybertruck": "Cybertruck",
  "CYBERTRUCK": "Cybertruck",
  "model s": "Model S",
  "MODEL S": "Model S",
  "model x": "Model X",
  "MODEL X": "Model X",
  "model 3": "Model 3",
  "MODEL 3": "Model 3",
  "model y": "Model Y",
  "MODEL Y": "Model Y",
  "roadster": "Roadster",
  "ROADSTER": "Roadster",
  "azimut": "Azimut",
  "AZIMUT": "Azimut",
  "sunseeker": "Sunseeker",
  "SUNSEEKER": "Sunseeker",
  "princess": "Princess",
  "PRINCESS": "Princess",
  "ferretti": "Ferretti",
  "FERRETTI": "Ferretti",
  "pershing": "Pershing",
  "PERSHING": "Pershing",
  "riva": "Riva",
  "RIVA": "Riva",
  "benetti": "Benetti",
  "BENETTI": "Benetti",
  "lurssen": "Lurssen",
  "LURSSEN": "Lurssen",
  "lürssen": "Lürssen",
  "LÜRSSEN": "Lürssen",
  "feadship": "Feadship",
  "FEADSHIP": "Feadship",
  "heesen": "Heesen",
  "HEESEN": "Heesen",
  "mangusta": "Mangusta",
  "MANGUSTA": "Mangusta",
};

function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}

function isUpperCaseAcronym(word: string): boolean {
  const upper = word.toUpperCase();
  return ACRONYMS.has(upper) || ACRONYMS.has(word);
}

function getAcronymCase(word: string): string | null {
  const upper = word.toUpperCase();
  if (ACRONYMS.has(upper)) return upper;
  for (const acr of ACRONYMS) {
    if (acr.toLowerCase() === word.toLowerCase()) return acr;
  }
  return null;
}

function capitalizeWord(word: string): string {
  if (word.length === 0) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function toTitleCaseSmart(input: string | null | undefined): string {
  if (!input) return "";
  
  let trimmed = input.trim();
  if (!trimmed) return "";

  for (const [key, value] of Object.entries(BRAND_MAPPINGS)) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(trimmed)) {
      const result = trimmed.replace(regex, value);
      if (result !== trimmed) {
        trimmed = result;
      }
    }
  }

  for (const [key, value] of Object.entries(MODEL_MAPPINGS)) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (regex.test(trimmed)) {
      const result = trimmed.replace(regex, value);
      if (result !== trimmed) {
        trimmed = result;
      }
    }
  }

  const tokens = trimmed.split(/(\s+|-|\/|&)/);
  
  const processedResult: string[] = [];
  let isFirstWord = true;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    if (/^(\s+|-|\/|&)$/.test(token)) {
      processedResult.push(token);
      continue;
    }

    if (isNumeric(token)) {
      processedResult.push(token);
      isFirstWord = false;
      continue;
    }

    const acronymCase = getAcronymCase(token);
    if (acronymCase) {
      processedResult.push(acronymCase);
      isFirstWord = false;
      continue;
    }

    const brandValue = Object.entries(BRAND_MAPPINGS).find(([k]) => k.toLowerCase() === token.toLowerCase())?.[1];
    if (brandValue) {
      processedResult.push(brandValue);
      isFirstWord = false;
      continue;
    }

    const modelValue = Object.entries(MODEL_MAPPINGS).find(([k]) => k.toLowerCase() === token.toLowerCase())?.[1];
    if (modelValue) {
      processedResult.push(modelValue);
      isFirstWord = false;
      continue;
    }

    const lowerToken = token.toLowerCase();
    if (!isFirstWord && MINOR_WORDS.has(lowerToken)) {
      processedResult.push(lowerToken);
      continue;
    }

    processedResult.push(capitalizeWord(token));
    isFirstWord = false;
  }

  return processedResult.join("");
}

export function normalizeColorField(input: string | null | undefined): string {
  if (!input) return "";
  return toTitleCaseSmart(input);
}

export function normalizeVehicleTitle(input: string | null | undefined): string {
  if (!input) return "";
  return toTitleCaseSmart(input);
}

export function normalizeShortTagline(input: string | null | undefined): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (trimmed.length > 100) {
    return trimmed;
  }
  return toTitleCaseSmart(trimmed);
}

export function normalizeInventoryFields(data: {
  name?: string | null;
  color?: string | null;
  interiorColor?: string | null;
  shortDescription?: string | null;
}): {
  name: string;
  color: string;
  interiorColor: string;
  shortDescription: string;
} {
  return {
    name: normalizeVehicleTitle(data.name),
    color: normalizeColorField(data.color),
    interiorColor: normalizeColorField(data.interiorColor),
    shortDescription: normalizeShortTagline(data.shortDescription),
  };
}
