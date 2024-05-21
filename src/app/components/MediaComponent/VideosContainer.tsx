"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./VideosContainer.module.css";
import download from "../../../../public/images/download.svg";
import Image from "next/image";
import MediaHeader from "./MediaHeader";
import { Video } from "@/app/Types";
import { getHighestResolutionVideo } from "@/app/utils/getHighestResolutionVideo";
import VideoPopup from "../VideoPopup/VideoPopup";

const VideosContainer = () => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVideoCklicked, setIsVideoCklicked] = useState<boolean>(false);
  const context = useMediaContext();
  const client = getPexelsClient();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

 
  const loadVideos = async () => {
    setLoading(true);
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
  }, [loading]);

  const memoizedVideos = useMemo(() => {
    return context.videos.videos.map((video: Video,key) => {
      const bestVideoFile = getHighestResolutionVideo(video.video_files);

      return (
        <div
          key={video.id+key}
          className={styles.videoWrapper}
          onClick={() => {
            setSelectedVideo(video);
            setIsVideoCklicked(true);
          }}
        >
          
          <div className={styles.overlay}>
            <Image
              src={download}
              alt="Download"
              onClick={() => {
                window.open(video.video_files[0].link, "_blank");
               }}
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
            // onLoadedData={handleVideoLoad}
          />
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.videos.videos]);
  return (
    <div>
      <MediaHeader title="Trending Free Stock Videos" />
      <div className={styles.videosContainer}>
        {memoizedVideos}
        {loading && <div className={styles.loadingIndicator}>Loading...</div>}
      </div>
      {isVideoCklicked && selectedVideo && (
        <VideoPopup video={selectedVideo} setIsVideoCklicked={setIsVideoCklicked} />
      )}
    </div>
  );
};

export default VideosContainer;
