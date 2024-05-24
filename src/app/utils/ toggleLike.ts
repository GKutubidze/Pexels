import { PhotosWithTotalResults } from "pexels";
import { Dispatch, SetStateAction } from "react";
 
export const toggleLike = (id: number,setPhotos:Dispatch<SetStateAction<PhotosWithTotalResults>>) => {

  
  
    setPhotos((prevPhotos) => {
     const updatedPhotos = prevPhotos.photos.map((photo) => {
       if (photo.id === id) {
         return { ...photo, liked: !photo.liked };
       }
       return photo;
     });
     return { ...prevPhotos, photos: updatedPhotos };
   });
 };