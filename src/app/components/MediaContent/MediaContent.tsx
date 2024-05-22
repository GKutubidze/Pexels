import { useMediaContext } from "@/app/Context/MediaContext";
import React from "react";
 import ImagesContainer from "../MediaComponent/ImagesContainer";
import MediaHeader from "../MediaComponent/MediaHeader";
import VideosContainer from "../MediaComponent/VideosContainer";
import { SearchMedia } from "../SearchComponent/SearchMedia";
import SearchVideo from "../SearchComponent/SearchVideo";
import { Liked } from "../Liked/Liked";

const MediaContent = () => {
  const context = useMediaContext();
  let mediaContent: JSX.Element | null = null;
   
  if (context.mediaType === "Home" && context.query.length <= 0) {
    mediaContent = (
      <>
        <MediaHeader title="Free Stock Photos" />
        <ImagesContainer />
      </>
    );
  } else if (context.query.length > 0 && context.searchType== "Photos") {
    mediaContent = <SearchMedia />;
  } else if (context.query.length > 0 && context.searchType == "Videos") {
    mediaContent = <SearchVideo />;
  } else if (context.mediaType === "Videos" && context.query.length <= 0) {
    mediaContent = <VideosContainer />;
  } else if (context.mediaType === "Liked" && context.query.length <= 0) {
    mediaContent = <Liked />;
  }

  return <>{mediaContent}</>;
};

export default MediaContent;

 