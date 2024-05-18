"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import download from "../../../../public/download.svg";
import styles from "./SearchVideo.module.css";

const SearchVideo = () => {
  const context = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const client = getPexelsClient();
  const searchVideos = async () => {
    try {
      const response = await client.videos.search({
        query: context.query,
        page: page,
        per_page: 10,
      });
      if ("videos" in response) {
        if (page === 1) {
          context.setSearchedVideos({
            videos: response.videos,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            url: response.url,
          });
        } else {
          context.setSearchedVideos((prevVideos) => ({
            videos: [...prevVideos.videos, ...response.videos],
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            url: response.url,
          }));
        }
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
     
    }
  };

  useEffect(() => {
    setPage(1); 
  }, [context.query]);

  useEffect(() => {
    searchVideos();
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
    <div className={styles.videosContainer}>
      {context.searchedVideos.videos.map((video) => (
        <div key={video.id} className={styles.videoWrapper}>
          <div className={styles.overlay} key={video.id}>
            <Image
              src={download}
              alt=""
              onClick={() => window.open(video.video_files[0].link, "_blank")}
              className={styles.downloadIcon}
              priority
            />
          </div>
          <video
            src={video.video_files[0].link}
            width="100%"
            height={video.height}
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
            muted
            loop
            className={styles.video}
          />
        </div>
      ))}
      {/* {context.loading && <p>Loading...</p>} */}
    </div>
  );
};

export default SearchVideo;
