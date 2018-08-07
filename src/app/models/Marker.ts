export class Marker {
  id: string; // Unique id for marker identification
  name?: string; // Marker name to be displayed in the map
  note?: string; // Marker note that will be displayed in an info window
  latitude: number; // Marker latitude
  longitude: number; // Marker longitude
  action?: string;
}
