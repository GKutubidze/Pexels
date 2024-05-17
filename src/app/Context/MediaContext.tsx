import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Photo, PhotosWithTotalResults } from "pexels";
type MediaType = "Home" | "Videos" | 'Challenges';

export interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  link: string;
}

export interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: VideoFile[];
  video_pictures: {
    id: number;
    picture: string;
    nr: number;
  }[];
}

export interface VideosWithTotalResults {
  page: number;
  per_page: number;
  total_results: number;
  url?: string;
  videos: Video[];
}

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
        setVideos
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};


 