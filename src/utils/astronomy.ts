// High-Precision Astronomical Coordinate & Sidereal Time Calculations
// Converts Equatorial Coordinates (RA, Dec) to Local Horizontal Coordinates (Altitude, Azimuth)

export interface UserLocation {
  city: string;
  latitude: number;
  longitude: number;
  isCustomGps?: boolean;
}

export const POPULAR_LOCATIONS: UserLocation[] = [
  { city: 'İstanbul', latitude: 41.0082, longitude: 28.9784 },
  { city: 'Ankara', latitude: 39.9334, longitude: 32.8597 },
  { city: 'İzmir', latitude: 38.4237, longitude: 27.1428 },
  { city: 'Antalya', latitude: 36.8969, longitude: 30.7133 },
  { city: 'Trabzon', latitude: 41.0027, longitude: 39.7168 },
  { city: 'Gaziantep', latitude: 37.0662, longitude: 37.3833 },
  { city: 'Erzurum', latitude: 39.9043, longitude: 41.2678 },
  { city: 'Londra (Greenwich)', latitude: 51.4769, longitude: 0.0005 },
  { city: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { city: 'Tokyo', latitude: 35.6762, longitude: 139.6503 }
];

/**
 * Calculates Local Sidereal Time (LST) in degrees [0, 360)
 * for a given JavaScript Date and geographic longitude in degrees.
 */
export function getLocalSiderealTime(date: Date, longitude: number): number {
  const timeMs = date.getTime();
  // Julian Date
  const jd = timeMs / 86400000 + 2440587.5;
  const d = jd - 2451545.0; // Days from J2000.0 epoch

  // Greenwich Mean Sidereal Time (GMST) in degrees
  let gmst = 280.46061837 + 360.98564736629 * d;

  // Local Sidereal Time = GMST + observer's longitude
  let lst = (gmst + longitude) % 360;
  if (lst < 0) lst += 360;
  return lst;
}

/**
 * Converts Equatorial Coordinates (RA, Dec) to Local Horizontal Coordinates (Altitude, Azimuth).
 * Altitude: Angle above horizon (-90° to +90°). > 0 means visible above the ground.
 * Azimuth: Angle along horizon from North (0° = North, 90° = East, 180° = South, 270° = West).
 */
export function raDecToAltAz(
  raDeg: number,
  decDeg: number,
  latDeg: number,
  lstDeg: number
): { alt: number; az: number; isVisible: boolean } {
  // Local Hour Angle: HA = LST - RA (in degrees)
  let ha = (lstDeg - raDeg) % 360;
  if (ha < 0) ha += 360;

  const haRad = (ha * Math.PI) / 180;
  const decRad = (decDeg * Math.PI) / 180;
  const latRad = (latDeg * Math.PI) / 180;

  // sin(Alt) = sin(Dec) * sin(Lat) + cos(Dec) * cos(Lat) * cos(HA)
  const sinAlt =
    Math.sin(decRad) * Math.sin(latRad) +
    Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altRad = Math.asin(Math.min(Math.max(sinAlt, -1), 1));

  // cos(Az) = (sin(Dec) - sin(Alt) * sin(Lat)) / (cos(Alt) * cos(Lat))
  const cosAlt = Math.cos(altRad);
  const cosLat = Math.cos(latRad);

  let azRad = 0;
  if (Math.abs(cosAlt * cosLat) > 1e-6) {
    const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (cosAlt * cosLat);
    azRad = Math.acos(Math.min(Math.max(cosAz, -1), 1));
    // If sin(HA) > 0, object is west of meridian -> Azimuth is 360 - Az
    if (Math.sin(haRad) > 0) {
      azRad = 2 * Math.PI - azRad;
    }
  }

  const alt = (altRad * 180) / Math.PI;
  const az = (azRad * 180) / Math.PI;

  return {
    alt,
    az,
    isVisible: alt > 0 // Object is above the local physical horizon
  };
}

/**
 * Converts Horizontal Coordinates (Alt, Az) to 3D Cartesian points on celestial dome.
 * Coordinates convention:
 * Y = Zenith (directly overhead)
 * -Y = Nadir (underground)
 * -Z = True North (Az = 0)
 * +X = True East (Az = 90)
 * +Z = True South (Az = 180)
 * -X = True West (Az = 270)
 */
export function altAzToCartesian(altDeg: number, azDeg: number, radius: number): [number, number, number] {
  const altRad = (altDeg * Math.PI) / 180;
  const azRad = (azDeg * Math.PI) / 180;

  const y = radius * Math.sin(altRad);
  const x = radius * Math.cos(altRad) * Math.sin(azRad);
  const z = -radius * Math.cos(altRad) * Math.cos(azRad);

  return [x, y, z];
}
