import { useMediaContext } from '@/app/Context/MediaContext';
import React from 'react'
import { Liked } from '../LIked/LIked';
import ImagesContainer from '../MediaComponent/ImagesContainer';
import MediaHeader from '../MediaComponent/MediaHeader';
import VideosContainer from '../MediaComponent/VideosContainer';
import { SearchMedia } from '../SearchComponent/SearchMedia';
import SearchVideo from '../SearchComponent/SearchVideo';

const MediaContent = () => {
    const context=useMediaContext();
    let mediaContent = null;

    if (context.mediaType === "Home" && context.query !== " ") {
      mediaContent = (
        <>
          <MediaHeader title="Free Stock Photos" />
          <ImagesContainer  />
        </>
      );
    } else if (context.mediaType === "Videos" && context.query !== " ") {
      mediaContent = <VideosContainer />;
    } else if (context.mediaType === "Liked" && context.query !== " ") {
      mediaContent = <Liked />;
    } else if (context.mediaType === "" && context.searchType === "Photos" ) {
      mediaContent = <SearchMedia />;
    } else if (context.mediaType === "" && context.searchType === "Videos") {
      mediaContent = <SearchVideo />;
    }
  return (
    <>{mediaContent}</> 
  )
}

export default MediaContent