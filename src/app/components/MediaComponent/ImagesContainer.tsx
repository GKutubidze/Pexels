"use client";
import React, { useContext, useEffect, useState, useMemo, lazy } from "react";
import styles from "./ImagesContainer.module.css";
import Image from "next/image";
import { MediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import { handleDownload } from "@/app/utils/handleDownload";
import { getUniquePhotos } from "@/app/utils/getUniquePhotos";
import { Photo } from "pexels/dist/types";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { toggleLike } from "@/app/utils/ toggleLike";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useLikedPhotos from "@/app/hooks/useLikedPhotos";
 

const ImagesContainer = () => {
  const { photos, setPhotos } = useContext(MediaContext);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const client = getPexelsClient();
  const width = useWindowWidth();
  const { likedPhotos,isPhotoLiked} = useLikedPhotos();

  const numberOfColumns = width <= 768 ? 2 : 3;

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };
  const user = useAuth();
  const supabase=supabaseBrowser()

  const handleLike = async (photo_id: number) => {
    const photo = photos.photos.find((item) => item.id === photo_id);

    if (!user) {
      alert('You need to log in to like a photo');
      return;
    }

    if (photo) {
      try {
        // Check if the photo is already liked
        const { data: existingLike, error: fetchError } = await supabase
          .from('liked_photos')
          .select('*')
          .eq('user_id', user.id)
          .eq('photo_id', photo_id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found
          throw fetchError;
        }

        if (existingLike) {
          // Photo is already liked, so we should delete it
          const { error: deleteError } = await supabase
            .from('liked_photos')
            .delete()
            .eq('user_id', user.id)
            .eq('photo_id', photo_id);

          if (deleteError) {
            throw deleteError;
          }

          console.log('Photo unliked');
        } else {
          // Photo is not liked, so we should insert it
          const { error: insertError } = await supabase
            .from('liked_photos')
            .insert([
              {
                user_id: user.id,
                user_email: user.email,
                photo_id: photo.id,
                width: photo.width,
                height: photo.height,
                photo_url: photo.url,
                photographer: photo.photographer,
                photographer_url: photo.photographer_url,
                photographer_id: photo.photographer_id,
                avg_color: photo.avg_color,
                src: photo.src,
                liked: photo.liked,
                alt: photo.alt,
              },
            ]);

          if (insertError) {
            throw insertError;
          }

          console.log('Photo liked');
        }
      } catch (error) {
        console.error('Error handling like/unlike photo:', error);
      }
    }

    // Assuming toggleLike updates the state accordingly
    toggleLike(photo_id, setPhotos);
  };



  const fetchPhotos = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await client.photos.curated({ page, per_page: 15 });
      if ("photos" in response) {
        const newPhotos = response.photos.filter(
          (newPhoto) =>
            !photos.photos.some(
              (existingPhoto) => existingPhoto.id === newPhoto.id
            )
        );
        setPhotos((prevPhotos) => {
          const allPhotos = [...prevPhotos.photos, ...newPhotos];
          return { ...prevPhotos, photos: getUniquePhotos(allPhotos) };
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPhotos(); // Initial fetch on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loadingMore &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
      ) {
        fetchPhotos();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore]);

  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    photos.photos.forEach((photo, index) => {
      columns[index % numberOfColumns].push(photo);
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
                    onClick={() =>
                      handleDownload(photo.src.original, photo.photographer)
                    }
                    width={25}
                    height={25}
                  />
                </div>
                <div
                  className={styles.heart}
                  onClick={() => handleLike(photo.id)}
                >
                  <Image
                    src={
                     (isPhotoLiked(photo.id))? "/images/heartred.svg" : "/images/heart.svg"
                    }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.photos]);

  return (
    <div>
      {memoizedPhotos}
      {loadingMore && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};

export default ImagesContainer;
