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
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useLikedVideos, { LikedVideo } from "@/app/hooks/useLikedVideos";
import { toggleVideoLike } from "@/app/utils/toggleVideoLike";
import VideoPopup from "../VideoPopup/VideoPopup";

const SearchVideo = () => {
  const { query, setSearchedVideos, searchedVideos } = useMediaContext();
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const width = useWindowWidth();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const client = getPexelsClient();
  const user = useAuth();
  const supabase = supabaseBrowser();
  const { likedVideos, setLikedVideos } = useLikedVideos();
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
 
  const isVideoLiked = (videoId: number) => {
    return likedVideos.some((likedVideo) => likedVideo.video_id === videoId);
  };

  const searchVideos = async () => {
    setLoading(true);
    try {
      const response = await client.videos.search({
        query: query,
        page: page,
        per_page: 10,
      });
      if ("videos" in response) {
        const videosWithLiked = response.videos.map((video) => ({
          ...video,
          liked: isVideoLiked(video.id),
        }));

        if (page === 1) {
          setSearchedVideos({
            videos: videosWithLiked,
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            url: response.url,
          });
        } else {
          setSearchedVideos((prevVideos) => ({
            videos: [...prevVideos.videos, ...videosWithLiked],
            page: response.page,
            per_page: response.per_page,
            total_results: response.total_results,
            url: response.url,
          }));
        }
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
    const video = searchedVideos.videos.find((item) => item.id === video_id);

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
    toggleVideoLike(video_id, setSearchedVideos);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    searchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100
      ) {
        searchVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const memoizedVideos = useMemo(() => {
    const columns: Video[][] = Array.from({ length: numberOfColumns }, () => []);
    searchedVideos.videos.forEach((video, index) => {
      columns[index % numberOfColumns].push(video);
    });

    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.videoColumn}>
            {column.map((video) => {
              const bestVideoFile = getHighestResolutionVideo(video.video_files);
              return (
                <div
                  key={video.id} // Use video ID as the unique key
                  className={styles.videoWrapper}
                  onClick={() => {
                    setSelectedVideo(video);
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
                      width={25}
                      height={25}
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
                    onClick={() => {
                      setSelectedVideo(video);
                       setIsPopupOpen(true)
                     }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedVideos.videos, likedVideos]);

  return (
    <div>
      {memoizedVideos}
      {loading && <div className={styles.loadingIndicator}>Loading...</div>}
      {isPopupOpen && (
        <VideoPopup
          video={selectedVideo}
          setIsPopupOpen={setIsPopupOpen}
        />
      )}
    </div>
  );
};

export default SearchVideo;
