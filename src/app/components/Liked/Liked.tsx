import { useMediaContext } from "@/app/Context/MediaContext";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { handleDownload } from "@/app/utils/handleDownload";
import styles from "./Liked.module.css";
import { toggleLike } from "@/app/utils/ toggleLike";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import useLikedPhotos, { LikedPhoto } from "@/app/hooks/useLikedPhotos";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";

type CompatiblePhoto = LikedPhoto & { id: number, url: string };

export const Liked = () => {
  const width = useWindowWidth();
  const { setPhotos } = useMediaContext();
  const { likedPhotos, isPhotoLiked } = useLikedPhotos(); // Get likedPhotos and isPhotoLiked
  const numberOfColumns = width <= 768 ? 2 : 3;
  const user = useAuth();
  const supabase = supabaseBrowser();
  const [localLikedPhotos, setLocalLikedPhotos] = useState<LikedPhoto[]>([]);

  useEffect(() => {
    setLocalLikedPhotos(likedPhotos);
  }, [likedPhotos]);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleDelete = async (photoId: number) => {
    if (user) {
      // Optimistically update the UI by removing the photo from the local state
      setLocalLikedPhotos((prevPhotos) => prevPhotos.filter(photo => photo.photo_id !== photoId));

      try {
        await supabase
          .from('liked_photos')
          .delete()
          .eq('user_id', user.id)
          .eq('photo_id', photoId);
      } catch (error) {
        console.error("Error deleting photo:", error);
        // Rollback the change in case of an error
        const photoToRestore = likedPhotos.find(photo => photo.photo_id === photoId);
        if (photoToRestore) {
          setLocalLikedPhotos((prevPhotos) => [...prevPhotos, photoToRestore]);
        }
      }
    }

    toggleLike(photoId, setPhotos);
  };

  const memoizedPhotos = useMemo(() => {
    const columns: CompatiblePhoto[][] = Array.from({ length: numberOfColumns }, () => []);
    localLikedPhotos.forEach((photo, index) => {
      const compatiblePhoto: CompatiblePhoto = {
        ...photo,
        id: photo.photo_id,
        url: photo.photo_url
      };
      columns[index % numberOfColumns].push(compatiblePhoto);
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
  }, [localLikedPhotos, numberOfColumns]);

  return <div>{memoizedPhotos}</div>;
};
