"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { MediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import { getUniquePhotos } from "@/app/utils/getUniquePhotos";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import PhotosGrid from "../PhotosGrid/PhotosGrid";

const ImagesContainer = () => {
  const { photos, setPhotos } = useContext(MediaContext);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [likedPhotoIds, setLikedPhotoIds] = useState<number[]>([]);
  const client = getPexelsClient();
  const user = useAuth();
  const supabase = supabaseBrowser();

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

          const likedPhotoIds = data.map(
            (item: { photo_id: number }) => item.photo_id
          );
          setLikedPhotoIds(likedPhotoIds);
        } catch (error) {
          console.error("Error fetching liked photos:", error);
        }
      }
    };

    fetchLikedPhotos();
  }, [user, supabase]);

  return (
    <div>
      <PhotosGrid
        photos={photos.photos}
        likedPhotoIds={likedPhotoIds}
        setPhotos={setPhotos}
        loadingMore={loadingMore}
        setLikedPhotoIds={setLikedPhotoIds}
        photoss={photos}
      />
    </div>
  );
};

export default ImagesContainer;
