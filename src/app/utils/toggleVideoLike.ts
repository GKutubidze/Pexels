import { VideosWithTotalResults, Video } from "@/app/Types";
import { Dispatch, SetStateAction } from "react";

export const toggleVideoLike = (
  id: number,
  setVideos: Dispatch<SetStateAction<VideosWithTotalResults>>
) => {
  setVideos((prevVideos) => {
    const updatedVideos = prevVideos.videos.map((video) => {
      if (video.id === id) {
        return { ...video, liked: !video.liked };
      }
      return video;
    });
    return { ...prevVideos, videos: updatedVideos };
  });
};
