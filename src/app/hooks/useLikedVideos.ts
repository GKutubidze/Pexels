import { useEffect, useState, useMemo, useCallback } from "react";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";

export interface LikedVideo {
  user_id: string;
  user_email: string;
  video_id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  link: string;
  created_at: string;
}

const useLikedVideos = () => {
  const user = useAuth();
  const supabase = supabaseBrowser();
  const [likedVideos, setLikedVideos] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLikedVideosFromDatabase = async (userId: string) => {
      try {
        const { data: likedVideos, error } = await supabase
          .from('liked_videos')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        setLikedVideos(likedVideos);
      } catch (error) {
        console.error('Error fetching liked videos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLikedVideosFromDatabase(user.id);
    }
  }, [user, supabase]);

  const isVideoLiked = useCallback(
    (videoId: number) => likedVideos.some(video => video.video_id === videoId),
    [likedVideos]
  );

  return { likedVideos, setLikedVideos, isVideoLiked, loading };
};

export default useLikedVideos;
