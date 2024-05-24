import { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "../utils/supabase/supabaseBrowser";
 
export interface LikedPhoto {
    user_email: string;
    photo_id: number;
    width: number;
    height: number;
    photo_url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: number;
    avg_color: string;
    liked: boolean;
    alt: string;
    src: any; // Adjust the type according to the actual structure
    created_at: string; // Or you can use a Date object
    user_id: string;
  }

const useLikedPhotos = () => {
  const user = useAuth();
  const supabase=supabaseBrowser();
  const [likedPhotos, setLikedPhotos] = useState<LikedPhoto[]>([]);
  const fetchLikedPhotosFromDatabase = async (userId:string) => {
    try {
      const { data: likedPhotos, error } = await supabase
        .from('liked_photos')
        .select('*')
        .eq('user_id', userId);
  
      if (error) {
        throw error;
      }
  
      // Return the retrieved liked photos data
      return likedPhotos;
    } catch (error) {
      console.error('Error fetching liked photos:', error);
      return [];
    }
  };
  
  
  useEffect(() => {
    // Function to retrieve liked photo IDs for the logged-in user from the database
    const fetchLikedPhotos = async () => {
      if (user) {
        // Fetch liked photo IDs for the current user from the database
        const response = await fetchLikedPhotosFromDatabase(user.id); // Implement this function to fetch liked photo IDs
        // Update state with the retrieved liked photo IDs
        setLikedPhotos(response);
      }
    };

    fetchLikedPhotos(); // Call the function when the component mounts
  }, [user]);

  // Function to check if a photo is liked based on its ID
  const isPhotoLiked = (photoId: number) => likedPhotos.some(photo => photo.photo_id === photoId);

  return { likedPhotos, isPhotoLiked };
};

export default useLikedPhotos;
