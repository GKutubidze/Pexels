'use client'
import React, { useContext, useEffect, useState } from "react";
import { MediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import ImagesContainer from "@/app/components/MediaComponent/ImagesContainer";
import styles from "./page.module.css"

const Page = ({ params }: { params: { query: string } }) => {
  const context = useContext(MediaContext);
  const [page, setPage] = useState<number>(1);
  const client = getPexelsClient();

  const searchPhotos = async (query: string, page: number) => {
    context.setLoading(true);
    try {
      const response = await client.photos.search({
        query: query,
        page: page,
        per_page: 10
      });
      if ("photos" in response) {
        context.setSearchedPhotos((prevPhotos) => ({
          photos: [...prevPhotos.photos, ...response.photos],
          page: response.page,
          per_page: response.per_page,
          total_results: response.total_results,
          next_page: response.next_page
        }));
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
    // Fetch initial data
    searchPhotos(params.query, page);
  }, [params.query]);

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
    if (page > 1) {
      searchPhotos(params.query, page);
    }
  }, [page]);

  return (
    <div className={styles.main}>
      <ImagesContainer photos={context.searchedPhotos} />
      {context.loading && <p>Loading...</p>}

    </div>
  );
};

export default Page;
