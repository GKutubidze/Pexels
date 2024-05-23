"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import download from "../../../../public/images/download.svg";
import styles from "./SearchVideo.module.css";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import LazyVideo from "../LazyVideo/LazyVideo";
import { Video } from "@/app/Types";
import { getHighestResolutionVideo } from "@/app/utils/getHighestResolutionVideo";

const SearchVideo = () => {
  const {query,setSearchedVideos,searchedVideos} = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const client = getPexelsClient();
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const searchVideos = async () => {
    try {
      const response = await client.videos.search({
        query: query,
        page: page,
        per_page: 10,
      });
      if ("videos" in response) {
        if (page === 1) {
           setSearchedVideos({
            videos: response.videos,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            url: response.url,
          });
        } else {
           setSearchedVideos((prevVideos) => ({
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
     setSearchedVideos({
      videos: [],
      page: 1,
      per_page: 10,
      total_results: 0,
      url: "",
    });
    setPage(1); 
  },  [query, setSearchedVideos]);

  useEffect(() => {
    searchVideos();
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

  const memoizedVideos = useMemo(() => {
    const columns:Video[][] = Array.from({ length: numberOfColumns }, () => []);
     searchedVideos.videos.forEach((video, index) => {
      columns[index % numberOfColumns].push(video);
    });

    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.videoColumn}>
            {column.map((video, index) => {
              const bestVideoFile = getHighestResolutionVideo(video.video_files);
              return (
                <div
                  key={index}
                  className={styles.videoWrapper}
                  onClick={() => (video)}
                >
                  <div className={styles.overlay}>
                    <Image
                      src={download}
                      alt="Download"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(video.video_files[0].link, "_blank");
                      }}
                      className={styles.downloadIcon}
                    />
                  </div>
                  <LazyVideo
                    src={bestVideoFile.link}
                    width="100%"
                    height={video.height}
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    preload="metadata"
                    muted
                    loop
                    className={styles.video}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ searchedVideos.videos]);

  return (
    <div >
        {memoizedVideos}
      {/* {context.loading && <p>Loading...</p>} */}
    </div>
  );
};

export default SearchVideo;
