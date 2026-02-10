export interface Place {
  id?: string;
  name: string;
  category: string;
  lat: number | string;
  lon: number | string;
  address?: string;
  image?: string;
  description?: string;

  placeImages?: { url: string }[];
  images?: string[];
  detail?: PlaceDetail;
}

export interface PlaceDetail {
  id?: number;
  placeId?: number;
  accessInfo?: string | null;
  priceInfo?: string | null;
  facilities?: string | null;
  contactInfo?: string | null;
  webUrl?: string | null;
}

export interface ScheduleItem {
  startDay: string;
  endDay: string;
  open: string;
  close: string;
  day?: string;
}
