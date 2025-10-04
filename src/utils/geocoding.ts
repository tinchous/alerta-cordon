const COORDINATE_REGEX = /(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const DEFAULT_COORDINATES: Coordinates = {
  latitude: -34.9075,
  longitude: -56.1668,
};

const KNOWN_LOCATIONS: Record<string, Coordinates> = {
  'paullier entre rivera y rodó': { latitude: -34.9075, longitude: -56.1668 },
  '18 de julio y ejido': { latitude: -34.905, longitude: -56.169 },
  'bv. artigas y misiones': { latitude: -34.91, longitude: -56.162 },
  'tristán narvaja y canelones': { latitude: -34.9045, longitude: -56.1645 },
  'abitab rivera y paullier': { latitude: -34.9077, longitude: -56.1662 },
  'almacén carlos - paullier y rodó': { latitude: -34.9073, longitude: -56.1671 },
  'rivera y paullier': { latitude: -34.9075, longitude: -56.1668 },
  '18 de julio y julio herrera y obes': { latitude: -34.9053, longitude: -56.1872 },
  'cordón': { latitude: -34.9033, longitude: -56.1646 },
};

function parseFromCoordinatesString(location: string): Coordinates | null {
  const match = location.match(COORDINATE_REGEX);
  if (!match) {
    return null;
  }

  const [, latString, lngString] = match;
  const latitude = Number.parseFloat(latString);
  const longitude = Number.parseFloat(lngString);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { latitude, longitude };
  }

  return null;
}

function lookupKnownLocation(location: string): Coordinates | null {
  const normalized = location.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (KNOWN_LOCATIONS[normalized]) {
    return KNOWN_LOCATIONS[normalized];
  }

  // Intentar coincidencia parcial buscando claves que estén contenidas en la ubicación
  const entry = Object.entries(KNOWN_LOCATIONS).find(([key]) => normalized.includes(key));
  return entry ? entry[1] : null;
}

export function geocodeLocation(location: string | null | undefined): Coordinates {
  if (!location) {
    return DEFAULT_COORDINATES;
  }

  const fromString = parseFromCoordinatesString(location);
  if (fromString) {
    return fromString;
  }

  const fromDictionary = lookupKnownLocation(location);
  if (fromDictionary) {
    return fromDictionary;
  }

  return DEFAULT_COORDINATES;
}

