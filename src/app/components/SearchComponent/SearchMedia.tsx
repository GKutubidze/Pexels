"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { lazy, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./SearchMedia.module.css";
import download from "../../../../public/images/download.svg";
import { handleDownload } from "@/app/utils/handleDownload";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { Photo } from "pexels/dist/types";
 import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useLikedPhotos, { LikedPhoto } from "@/app/hooks/useLikedPhotos";
import useAuth from "@/app/hooks/useAuth";
import { toggleLike } from "@/app/utils/ toggleLike";

const LazyImage = lazy(() => import("next/image"));

export const SearchMedia = () => {
  const { searchedPhotos, setSearchedPhotos, query } = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const [loadingMorePicture, setLoadingMorePicture] = useState<boolean>(false);
  const [likedPhotoIds, setLikedPhotoIds] = useState<number[]>([]);
  const client = getPexelsClient();
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleImageError = () => {
    console.error("Error loading image");
  };

  const user = useAuth();
  const supabase = supabaseBrowser();
  const { setLikedPhotos, isPhotoLiked } = useLikedPhotos();

  const handleLike = async (photo_id: number) => {
    const photo = searchedPhotos.photos.find((item) => item.id === photo_id);

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

          setLikedPhotos((prevLikedPhotos) => [...prevLikedPhotos, newLikedPhoto]);

          setLikedPhotoIds((prevLikedPhotoIds) => [...prevLikedPhotoIds, photo_id]);

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

    toggleLike(photo_id, setSearchedPhotos);
  };

  const searchPhotos = async (newQuery: string, newPage: number) => {
    setLoadingMorePicture(true);
    try {
      const response = await client.photos.search({
        query: newQuery,
        page: newPage,
        per_page: 10,
      });

      if ("photos" in response) {
        if (newPage === 1) {
          setSearchedPhotos({
            photos: response.photos,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            next_page: response.next_page,
          });
        } else {
          setSearchedPhotos((prevPhotos) => ({
            ...prevPhotos,
            photos: [...prevPhotos.photos, ...response.photos],
            page: response.page,
            next_page: response.next_page,
          }));
        }
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingMorePicture(false);
    }
  };

  useEffect(() => {
    if (query.trim() !== "") {
      setPage(1); // Reset page to 1 when query changes
      setSearchedPhotos({
        photos: [], // Clear searched photos when query changes
        page: 0,
        per_page: 0,
        total_results: 0,
        next_page: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (query.trim() !== "") {
      searchPhotos(query, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchLikedPhotos = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("liked_photos")
            .select("photo_id")
            .eq("user_id", user.id);

          if (error) {
            throw error;
          }

          const likedPhotoIds = data.map((item: { photo_id: number }) => item.photo_id);
          setLikedPhotoIds(likedPhotoIds);
        } catch (error) {
          console.error("Error fetching liked photos:", error);
        }
      }
    };

    fetchLikedPhotos();
  }, [user, supabase]);

  const memoizedPhotos = useMemo(() => {
    // Create arrays to hold the images for each column
    const columns: Photo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    searchedPhotos.photos.forEach((photo, index) => {
      columns[index % numberOfColumns].push(photo);
    });

    return (
      <div className={styles.photosContainer}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoColumn}>
            {column.map((photo, index) => (
              <div key={index} className={styles.photoWrapper}>
                <div className={styles.overlay}>
                  <Image
                    src={download}
                    alt="Download"
                    onClick={() => handleDownload(photo.src.original, photo.photographer)}
                  />
                </div>
                <div className={styles.heart} onClick={() => handleLike(photo.id)}>
                  <Image
                    src={likedPhotoIds.includes(photo.id) ? "/images/heartred.svg" : "/images/heart.svg"}
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>
                <Image
                  src={photo.src.original}
                  alt={photo.alt || ""}
                  width={500}
                  height={500}
                  className={styles.photo}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  priority
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedPhotos.photos, likedPhotoIds, numberOfColumns]);

  return (
    <div>
      {memoizedPhotos}
      {loadingMorePicture && <div className={styles.loadingIndicator}>Loading...</div>}
    </div>
  );
};
