import { useMediaContext } from "@/app/Context/MediaContext";
import React, { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { handleDownload } from "@/app/utils/handleDownload";
import styles from "./Liked.module.css";
import { toggleLike } from "@/app/utils/ toggleLike";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import useLikedPhotos, { LikedPhoto } from "@/app/hooks/useLikedPhotos";
import useAuth from "@/app/hooks/useAuth";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useLikedVideos, { LikedVideo } from "@/app/hooks/useLikedVideos";
import { toggleVideoLike } from "@/app/utils/toggleVideoLike";
import icon from "../../../../public/images/icon-down.svg";
import up from "../../../../public/images/icon-up.svg";
import correct from "../../../../public/images/correct.svg";
import download from "../../../../public/images/download.svg";

type CompatiblePhoto = LikedPhoto & { id: number; url: string };
type CompatibleVideo = LikedVideo & { id: number; url: string };
type temp = "Photos" | "Videos" | "All";

export const Liked = () => {
  const width = useWindowWidth();
  const { setPhotos, setVideos } = useMediaContext();
  const { likedPhotos, isPhotoLiked } = useLikedPhotos();
  const { likedVideos, isVideoLiked } = useLikedVideos();
  const numberOfColumns = width <= 768 ? 2 : 3;
  const user = useAuth();
  const supabase = supabaseBrowser();
  const [localLikedPhotos, setLocalLikedPhotos] = useState<LikedPhoto[]>([]);
  const [localLikedVideos, setLocalLikedVideos] = useState<LikedVideo[]>([]);
  const [filter, setFilter] = useState<temp>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: temp) => {
    setFilter(option);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    setLocalLikedPhotos(likedPhotos);
    setLocalLikedVideos(likedVideos); // Set localLikedVideos state
  }, [likedPhotos, likedVideos]);

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };

  const handleDelete = async (photoId: number) => {
    if (user) {
      // Optimistically update the UI by removing the photo from the local state
      setLocalLikedPhotos((prevPhotos) =>
        prevPhotos.filter((photo) => photo.photo_id !== photoId)
      );

      try {
        await supabase
          .from("liked_photos")
          .delete()
          .eq("user_id", user.id)
          .eq("photo_id", photoId);
      } catch (error) {
        console.error("Error deleting photo:", error);
        // Rollback the change in case of an error
        const photoToRestore = likedPhotos.find(
          (photo) => photo.photo_id === photoId
        );
        if (photoToRestore) {
          setLocalLikedPhotos((prevPhotos) => [...prevPhotos, photoToRestore]);
        }
      }
    }

    toggleLike(photoId, setPhotos);
  };

  const handleVideoDelete = async (videoId: number) => {
    if (user) {
      // Optimistically update the UI by removing the photo from the local state
      setLocalLikedVideos((prevPhotos) =>
        prevPhotos.filter((video) => video.video_id !== videoId)
      );

      try {
        await supabase
          .from("liked_videos")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId);
      } catch (error) {
        console.error("Error deleting photo:", error);
        // Rollback the change in case of an error
        const videoToRestore = likedVideos.find(
          (video) => video.video_id === videoId
        );
        if (videoToRestore) {
          setLocalLikedVideos((prevVideos) => [...prevVideos, videoToRestore]);
        }
      }
    }

    toggleVideoLike(videoId, setVideos);
  };


 
  const memoizedPhotos = useMemo(() => {
    const columns: CompatiblePhoto[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    localLikedPhotos.forEach((photo, index) => {
      const compatiblePhoto: CompatiblePhoto = {
        ...photo,
        id: photo.photo_id,
        url: photo.photo_url,
      };
      columns[index % numberOfColumns].push(compatiblePhoto);
    });

    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoWrapper}>
            {column.map((photo, index) => (
              <div key={index} className={styles.photoContainer}>
                <div className={styles.overlay}>
                  <Image
                    src={"/images/download.svg"}
                    alt=""
                    onClick={() =>
                      handleDownload(photo.src.original, photo.photographer)
                    }
                    width={25}
                    height={25}
                  />
                </div>
                <div
                  className={styles.heart}
                  onClick={() => handleDelete(photo.id)}
                >
                  <Image
                    src={"/images/heartred.svg"}
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>
                <Image
                  key={index}
                  src={photo.src.original}
                  alt={photo.alt || ""}
                  width={500}
                  height={500}
                  className={styles.photo}
                  onLoad={handleImageLoad}
                  priority
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localLikedPhotos, numberOfColumns]);

  const memoizedVideos = useMemo(() => {
    const columns: CompatibleVideo[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    localLikedVideos.forEach((video, index) => {
      const compatibleVideo: CompatibleVideo = {
        ...video,
        id: video.video_id,
        url: video.link,
      };
      columns[index % numberOfColumns].push(compatibleVideo);
    });

    return (
      <div className={styles.container}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.photoWrapper}>
            {column.map((video, index) => (
              <div key={index} className={styles.videoContainer}>
                <div className={styles.overlay}>
                  <Image
                    src={"/images/download.svg"}
                    alt="Download"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(video.link, "_blank");
                     }}
                    className={styles.downloadIcon}
                    width={25}
                    height={25}
                  />
                </div>
                <div
                  className={styles.heart}
                  onClick={() => handleVideoDelete(video.id)}
                >
                  <Image
                    src={"/images/heartred.svg"}
                    alt="like"
                    key={index}
                    width={25}
                    height={25}
                  />
                </div>
                <video
                  src={video.link}
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
            ))}
          </div>
        ))}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localLikedVideos, numberOfColumns]);

  const handleFilterChange = (selectedFilter: temp) => {
    setFilter(selectedFilter);
  };

  return (
    <div className={styles.main}>
      <div className={styles.menuContainer}>
      <div
        className={styles.trendingContainer}
        onClick={toggleDropdown}
        ref={dropdownRef}
      >
        <p>{filter}</p>
        {!isDropdownOpen ? (
          <Image src={icon} alt="" />
        ) : (
          <Image src={up} alt="" />
        )}
        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            <div
              onClick={() => handleOptionClick("All")}
              className={styles.child}
            >
              All {filter === "All" && <Image src={correct} alt="" />}
            </div>
            <div
              onClick={() => handleOptionClick("Photos")}
              className={styles.child}
            >
              Photos {filter === "Photos" && <Image src={correct} alt="" />}
            </div>
            <div
              onClick={() => handleOptionClick("Videos")}
              className={styles.child}
            >
              Videos {filter === "Videos" && <Image src={correct} alt="" />}
            </div>
          </div>
        )}
      </div>
      </div>
     
      {filter === "Photos" ? (
        memoizedPhotos
      ) : filter === "Videos" ? (
        memoizedVideos
      ) : (
        <>
          {memoizedPhotos}
          {memoizedVideos}
        </>
      )}
    </div>
  );
};
