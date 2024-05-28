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
  src: any; 
  created_at: string; 
  user_id: string;
}

const useLikedPhotos = () => {
  const user = useAuth();
  const supabase = supabaseBrowser();
  const [likedPhotos, setLikedPhotos] = useState<LikedPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

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
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching liked photos:', error);
        setLoading(false); 
      }
    };

    if (user) {
      fetchLikedPhotosFromDatabase(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

 
  const isPhotoLiked = useMemo(() => (photoId: number) => likedPhotos.some(photo => photo.photo_id === photoId), [likedPhotos]);

  return { likedPhotos, setLikedPhotos, isPhotoLiked, loading }; 
};

export default useLikedPhotos;
