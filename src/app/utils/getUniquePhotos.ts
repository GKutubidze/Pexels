import { Photo } from "pexels";

export const getUniquePhotos = (photos: Photo[]) => {
    const uniquePhotosMap = new Map();
    photos.forEach((photo) => uniquePhotosMap.set(photo.id, photo));
    return Array.from(uniquePhotosMap.values());
  };
