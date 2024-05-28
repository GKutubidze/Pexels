"use client";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./VideosContainer.module.css";
import download from "../../../../public/images/download.svg";
import Image from "next/image";
import MediaHeader from "./MediaHeader";
import { getHighestResolutionVideo } from "@/app/utils/getHighestResolutionVideo";
import VideoPopup from "../VideoPopup/VideoPopup";
import LazyVideo from "../LazyVideo/LazyVideo";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { Video } from "@/app/Types";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useLikedVideos, { LikedVideo } from "@/app/hooks/useLikedVideos";
import { toggleVideoLike } from "@/app/utils/toggleVideoLike";

const VideosContainer = () => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVideoCklicked, setIsVideoCklicked] = useState<boolean>(false);
  const {setVideos,videos} = useMediaContext();
  const client = getPexelsClient();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const user = useAuth();
  const supabase = supabaseBrowser();

  const {isVideoLiked,setLikedVideos}=useLikedVideos();
  
  
  const loadVideos = async () => {
    setLoading(true);
    try {
      const response = await client.videos.popular({ per_page: 10, page });
      if ("videos" in response) {
        const videosWithLiked = response.videos.map((video) => ({
          ...video,
          liked: isVideoLiked(video.id),
        }));

        setVideos((prevVideos) => ({
          ...prevVideos,
          page: response.page,
          per_page: response.per_page,
          total_results: response.total_results,
          url: response.url,
          videos: [...prevVideos.videos, ...videosWithLiked],
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

  const handleLike = async (video_id: number) => {
    const video = videos.videos.find((item) => item.id === video_id);

    if (!user) {
      alert("You need to log in to like a video");
      return;
    }

    if (video) {
      try {
        const { data: existingLike, error: fetchError } = await supabase
          .from("liked_videos")
          .select("*")
          .eq("user_id", user.id)
          .eq("video_id", video_id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        if (existingLike) {
          setLikedVideos((prevLikedVideos) =>
            prevLikedVideos.filter((video) => video.video_id !== video_id)
          );

          const { error: deleteError } = await supabase
            .from("liked_videos")
            .delete()
            .eq("user_id", user.id)
            .eq("video_id", video_id);

          if (deleteError) {
            throw deleteError;
          }

          console.log("Video unliked");
        } else {
          const newLikedVideo: LikedVideo = {
            user_id: user.id,
            user_email: user.email as string,
            video_id: video.id,
            width: video.width,
            height: video.height,
            url: video.url,
            image: video.image,
            duration: video.duration,
            link: getHighestResolutionVideo(video.video_files).link,
            created_at: new Date().toISOString(),
          };

          setLikedVideos((prevLikedVideos) => [
            ...prevLikedVideos,
            newLikedVideo,
          ]);

          const { error: insertError } = await supabase
            .from("liked_videos")
            .insert([newLikedVideo]);

          if (insertError) {
            throw insertError;
          }

          console.log("Video liked");
        }
      } catch (error) {
        console.error("Error handling like/unlike video:", error);
        alert(`Error: ${error}`);
      }
    }
    toggleVideoLike(video_id, setVideos);
  };
  useEffect(() => {
    loadVideos(); // Initial fetch on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    const columns: Video[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    videos.videos.forEach((video, index) => {
      columns[index % numberOfColumns].push(video);
    });

    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.videoColumn}>
            {column.map((video, index) => {
              const bestVideoFile = getHighestResolutionVideo(
                video.video_files
              );
              return (
                <div
                  key={index}
                  className={styles.videoWrapper}
                  onClick={() => {
                    setSelectedVideo(video);
                    // setIsVideoClicked(true);
                  }}
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
                  <div
                  className={styles.heart}
                  onClick={() => handleLike(video.id)}
                >
                  <Image
                   src={
                    isVideoLiked(video.id)
                      ? "/images/heartred.svg"
                      : "/images/heart.svg"
                  }
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
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
  }, [videos.videos]);
  return (
    <div>
      <MediaHeader title="Trending Free Stock Videos" />
      <div>
        {memoizedVideos}
        {loading && <div className={styles.loadingIndicator}>Loading...</div>}
      </div>
      {isVideoCklicked && selectedVideo && (
        <VideoPopup
          video={selectedVideo}
          setIsVideoCklicked={setIsVideoCklicked}
        />
      )}
    </div>
  );
};

export default VideosContainer;
