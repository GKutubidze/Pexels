interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  avg_color: string | null;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string | null; // Make alt nullable
}


export interface PhotosResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: Photo[]; // Assuming Photo type is defined elsewhere
  next_page: string | null; // Update type to match actual response
}
