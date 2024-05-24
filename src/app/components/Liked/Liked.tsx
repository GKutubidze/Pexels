import { useMediaContext } from "@/app/Context/MediaContext";
import React, { useMemo, useState, useEffect, useContext } from "react"; // Import useState and useEffect
import Image from "next/image";
import { handleDownload } from "@/app/utils/handleDownload";
import styles from "./Liked.module.css";
import { toggleLike } from "@/app/utils/ toggleLike";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import useLikedPhotos, { LikedPhoto } from "@/app/hooks/useLikedPhotos";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
 
// Adjust the type of Photo to be compatible with LikedPhoto
type CompatiblePhoto = LikedPhoto & { id: number, url: string };

export const Liked = () => {
  const width = useWindowWidth();
  const {setPhotos}=useMediaContext();
  const { likedPhotos} = useLikedPhotos();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const user = useAuth();
  const supabase = supabaseBrowser();
  const [deletedPhotoId, setDeletedPhotoId] = useState<number | null>(null); // State to track deleted photo ID

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleDelete = async (photoId: number) => {
    if(user) {
      try {
        await supabase
          .from('liked_photos')
          .delete()
          .eq('user_id', user.id)
          .eq('photo_id', photoId);
        setDeletedPhotoId(photoId); // Update state to trigger re-render
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
    toggleLike(photoId,setPhotos)
  };

  useEffect(() => {
    // Reset the deleted photo ID after re-render
    setDeletedPhotoId(null);
  }, [likedPhotos]); // Reset when likedPhotos changes

  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: CompatiblePhoto[][] = Array.from({ length: numberOfColumns }, () => []);
    likedPhotos.forEach((photo: LikedPhoto, index: number) => {
      // Convert LikedPhoto to CompatiblePhoto by adding id and url properties
      const compatiblePhoto: CompatiblePhoto = {
        ...photo,
        id: photo.photo_id, // Adjust according to your actual structure
        url: photo.photo_url // Adjust according to your actual structure
      };
      // Exclude deleted photo from rendering
      if (photo.photo_id !== deletedPhotoId) {
        columns[index % numberOfColumns].push(compatiblePhoto);
      }
    });

    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoWrapper}>
            {column.map((photo, index) => (
              <div key={index} className={styles.photoContainer}>
                <div className={styles.overlay}>
                  <Image
                    src={"/images/download.svg"}
                    alt=""
                    onClick={() => handleDownload(photo.src.original, photo.photographer)}
                    width={25}
                    height={25}
                  />
                </div>
                <div className={styles.heart} onClick={() => handleDelete(photo.id)}>
                  <Image
                    src={"/images/heartred.svg"}
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>
                <Image
                  key={index}
                  src={photo.src.original}
                  alt={photo.alt || ""}
                  width={500}
                  height={500}
                  className={styles.photo}
                  onLoad={handleImageLoad}
                  priority
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }, [likedPhotos, deletedPhotoId]); // Update when likedPhotos or deletedPhotoId changes

  return (
    <div>
      {memoizedPhotos}
    </div>
  );
};
