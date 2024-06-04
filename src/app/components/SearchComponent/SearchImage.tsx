"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useState } from "react";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useAuth from "@/app/hooks/useAuth";
import PhotosGrid from "../PhotosGrid/PhotosGrid";

export const SearchImage = () => {
  const { searchedPhotos, setSearchedPhotos, query } = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const [loadingMorePicture, setLoadingMorePicture] = useState<boolean>(false);
  const [likedPhotoIds, setLikedPhotoIds] = useState<number[]>([]);

  const client = getPexelsClient();

  const user = useAuth();
  const supabase = supabaseBrowser();

  const searchPhotos = async (newQuery: string, newPage: number) => {
    if (!client) return;
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
        photos={searchedPhotos.photos}
        likedPhotoIds={likedPhotoIds}
        setLikedPhotoIds={setLikedPhotoIds}
        setPhotos={setSearchedPhotos}
        loadingMore={loadingMorePicture}
        photoss={searchedPhotos}
      />
    </div>
  );
};
