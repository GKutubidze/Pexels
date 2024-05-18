"use client";
import { MediaContext, useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, {   useEffect, useState } from "react";
import ImagesContainer from "../MediaComponent/ImagesContainer";

export const SearchMedia = () => {
  const context=useMediaContext()
  const [page, setPage] = useState<number>(1);
  const client = getPexelsClient();

  const searchPhotos = async () => {
    context.setLoading(true);
    try {
      const response = await client.photos.search({
        query: context.query,
        page: page,
        per_page: 10,
      });
      if ("photos" in response) {
        if (page === 1) {
          // If it's the first page of a new query, replace the existing photos
          context.setSearchedPhotos({
            photos: response.photos,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            next_page: response.next_page,
          });
        } else {
          // If it's a subsequent page, append the new photos
          context.setSearchedPhotos((prevPhotos) => ({
            photos: [...prevPhotos.photos, ...response.photos],
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            next_page: response.next_page,
          }));
        }
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      context.setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset page to 1 when query changes
  }, [context.query]);

  useEffect(() => {
    searchPhotos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.query, page]);

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

  return (
    <div>
      <ImagesContainer photos={context.searchedPhotos} />
      {context.loading && <p>Loading...</p>}
    </div>
  );
};
