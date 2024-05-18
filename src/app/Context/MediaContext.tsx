import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Photo, PhotosWithTotalResults } from "pexels";
import { MediaType, SearchType, VideosWithTotalResults } from "../Types";



export interface Props {
  searchedPhotos: PhotosWithTotalResults;
  setSearchedPhotos: Dispatch<SetStateAction<PhotosWithTotalResults>>;
  photos: PhotosWithTotalResults;
  setPhotos: Dispatch<SetStateAction<PhotosWithTotalResults>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  randomPhoto: Photo | undefined;
  setRandomPhoto: Dispatch<SetStateAction<Photo | undefined>>;
  query:string,
  setQuery: Dispatch<SetStateAction<string>>;
  mediaType:MediaType;
  setMediaType: Dispatch<SetStateAction<MediaType>>,
  videos: VideosWithTotalResults;
  setVideos: Dispatch<SetStateAction<VideosWithTotalResults>>;
  searchedVideos: VideosWithTotalResults;
  setSearchedVideos: Dispatch<SetStateAction<VideosWithTotalResults>>;
  searchType:SearchType;
  setSearchType:Dispatch<SetStateAction<SearchType>>;


}

// Default values for context props
const defaultContextValues: Props = {
  searchedPhotos: {
    photos: [],
    page: 0,
    per_page: 0,
    total_results: 0,
    next_page: 0
  },
  setSearchedPhotos: () => {},
  photos: {
    photos: [],
    page: 0,
    per_page: 0,
    total_results: 0,
    next_page: 0
  },
  setPhotos: () => {},
  loading: false,
  setLoading: () => {},
  randomPhoto: undefined,
  setRandomPhoto: () => {},
  query:"",
  setQuery: () => {},
  mediaType:"Home",
  setMediaType:() => {},
  videos: {
    page: 0,
    per_page: 0,
    total_results: 0,
    videos: [],
  },
  setVideos: () => {},
  searchedVideos: {
    page: 0,
    per_page: 0,
    total_results: 0,
    videos: [],
  },
  setSearchedVideos: () => {},
  searchType:"Photos",
  setSearchType: () => {},

};

// Create the context and provide default values
export const MediaContext = createContext<Props>(defaultContextValues);


export const MediaContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [mediaType,setMediaType]=useState<MediaType>("Home");
  const [searchedPhotos, setSearchedPhotos] = useState<PhotosWithTotalResults>(
    defaultContextValues.searchedPhotos
  );

  const [photos, setPhotos] = useState<PhotosWithTotalResults>(
    defaultContextValues.photos
  );
  const [query, setQuery] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(defaultContextValues.loading);
  const [randomPhoto, setRandomPhoto] = useState<Photo | undefined>(
    defaultContextValues.randomPhoto
  );

  const [videos, setVideos] = useState<VideosWithTotalResults>(
    defaultContextValues.videos
  );

  const [searchedVideos, setSearchedVideos] = useState<VideosWithTotalResults>(
    defaultContextValues.searchedVideos
  );
  const [searchType,setSearchType]=useState<SearchType>("Photos");
  return (
    <MediaContext.Provider
      value={{
        searchedPhotos,
        setSearchedPhotos,
        photos,
        setPhotos,
        loading,
        setLoading,
        randomPhoto,
        setRandomPhoto,
        query,
        setQuery,
        mediaType,
        setMediaType,
        videos,
        setVideos,
        searchedVideos,
        setSearchedVideos,
        searchType,
        setSearchType
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};


export function useMediaContext() {
  const context = useContext(MediaContext);

  if (!context) {
    throw new Error("useMediaContext must be used within a MediaContextProvider");
  }

  return context;
}