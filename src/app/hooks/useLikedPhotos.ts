import { useEffect, useState, useMemo } from "react";
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
  const supabase = supabaseBrowser();
  const [likedPhotos, setLikedPhotos] = useState<LikedPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchLikedPhotosFromDatabase = async (userId: string) => {
      try {
        const { data: likedPhotos, error } = await supabase
          .from('liked_photos')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        setLikedPhotos(likedPhotos);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching liked photos:', error);
        setLoading(false); // Set loading to false on error
      }
    };

    if (user) {
      fetchLikedPhotosFromDatabase(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Memoized function to check if a photo is liked based on its ID
  const isPhotoLiked = useMemo(() => (photoId: number) => likedPhotos.some(photo => photo.photo_id === photoId), [likedPhotos]);

  return { likedPhotos, setLikedPhotos, isPhotoLiked, loading }; // Return loading state
};

export default useLikedPhotos;
