import { SupabaseClient, User } from "@supabase/supabase-js";
import { PhotosWithTotalResults } from "pexels/dist/types";
import { LikedPhoto } from "../hooks/useLikedPhotos";
import { toggleLike } from "./ toggleLike";

export const handleLike = async (
  photo_id: number,
  photos: PhotosWithTotalResults,
  user: User | null,
  supabase: SupabaseClient<any, "public", any>,
  setLikedPhotos: React.Dispatch<React.SetStateAction<LikedPhoto[]>>,
  setPhotos: React.Dispatch<React.SetStateAction<PhotosWithTotalResults>>,
  setLikedPhotoIds: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const photo = photos.photos.find((item) => item.id === photo_id);

  if (!user) {
    alert("You need to log in to like a photo");
    return;
  }

  if (photo) {
    try {
      const { data: existingLike, error: fetchError } = await supabase
        .from("liked_photos")
        .select("*")
        .eq("user_id", user.id)
        .eq("photo_id", photo_id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingLike) {
        setLikedPhotos((prevLikedPhotos) =>
          prevLikedPhotos.filter((photo) => photo.photo_id !== photo_id)
        );

        setLikedPhotoIds((prevLikedPhotoIds) =>
          prevLikedPhotoIds.filter((id) => id !== photo_id)
        );

        const { error: deleteError } = await supabase
          .from("liked_photos")
          .delete()
          .eq("user_id", user.id)
          .eq("photo_id", photo_id);

        if (deleteError) {
          throw deleteError;
        }

        console.log("Photo unliked");
      } else {
        const newLikedPhoto: LikedPhoto = {
          user_id: user.id,
          user_email: user.email as string,
          photo_id: photo.id,
          width: photo.width,
          height: photo.height,
          photo_url: photo.url,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          photographer_id: Number(photo.photographer_id),
          avg_color: photo.avg_color || "",
          src: photo.src,
          liked: photo.liked,
          alt: photo.alt || "",
          created_at: new Date().toISOString(),
        };

        setLikedPhotos((prevLikedPhotos) => [
          ...prevLikedPhotos,
          newLikedPhoto,
        ]);

        setLikedPhotoIds((prevLikedPhotoIds) => [
          ...prevLikedPhotoIds,
          photo_id,
        ]);

        const { error: insertError } = await supabase
          .from("liked_photos")
          .insert([newLikedPhoto]);

        if (insertError) {
          throw insertError;
        }

        console.log("Photo liked");
      }
    } catch (error) {
      console.error("Error handling like/unlike photo:", error);
      alert(`Error: ${error}`);
    }
  }

  toggleLike(photo_id, setPhotos);
};
