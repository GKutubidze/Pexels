"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useState } from "react";
import styles from "./VideosContainer.module.css";
import download from "../../../../public/download.svg";
import Image from "next/image";
import MediaHeader from "./MediaHeader";
import { Video } from "@/app/Types";
import { getHighestResolutionVideo } from "@/app/utils/getHighestResolutionVideo";
import VideoPopup from "../VideoPopup/VideoPopup";

const VideosContainer = () => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [allVideosLoaded, setAllVideosLoaded] = useState<boolean>(true);
  const context = useMediaContext();
  const client = getPexelsClient();
  const [isVideoCklicked,setIsVideoCklicked]=useState<boolean>(false);

  const loadVideos = async () => {
    setLoading(true);
    setAllVideosLoaded(false);
    try {
      const response = await client.videos.popular({ per_page: 10, page });
      if ("videos" in response) {
        context.setVideos((prevVideos) => ({
          ...prevVideos,
          page: response.page,
          per_page: response.per_page,
          total_results: response.total_results,
          url: response.url,
          videos: [...prevVideos.videos, ...response.videos],
        }));
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Error response:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        allVideosLoaded &&
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 // Add some buffer
      ) {
        loadVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, allVideosLoaded]);

  const handleVideoLoad = () => {
    const videos = document.querySelectorAll("video");
    let allLoaded = true;
    videos.forEach((video) => {
      if (video.readyState < 4) {
        allLoaded = false;
      }
    });
    setAllVideosLoaded(allLoaded);
  };

  return (
    <div>
      
      <MediaHeader title="Trending Free Stock Videos" />
      <div className={styles.videosContainer}>
        {context.videos.videos.map((video: Video) => {
          const bestVideoFile = getHighestResolutionVideo(video.video_files);
          return (
            <div key={video.id} className={styles.videoWrapper}>
             
              <div className={styles.overlay}>
                <Image
                  src={download}
                  alt="Download"
                  onClick={() => {window.open(video.video_files[0].link, "_blank")
                  console.log("fdfd");

                  }
                    
                  }
                  className={styles.downloadIcon}
                />
              </div>
              <video
                src={bestVideoFile.link}
                width="100%"
                height={video.height}
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
                preload="metadata"
                muted
                loop
                className={styles.video}
                onLoadedData={handleVideoLoad}
              />
            </div>
          );
        })}
        {loading && <div className={styles.loadingIndicator}>Loading...</div>}
      </div>
    </div>
  );
};

export default VideosContainer;
