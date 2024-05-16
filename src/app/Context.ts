'use client'
import { createContext, Dispatch, SetStateAction } from "react";
import { Photo, PhotosWithTotalResults } from "pexels";

export interface Props {
  searchedPhotos: PhotosWithTotalResults;
  setSearchedPhotos: Dispatch<SetStateAction<PhotosWithTotalResults>>;
  photos:PhotosWithTotalResults;
  setPhotos: Dispatch<SetStateAction<PhotosWithTotalResults>>;
  loading:boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  randomPhoto:Photo | undefined,
  setRandomPhoto: Dispatch<SetStateAction<Photo | undefined>>
}

// Create the context and provide default values
export const MyContext = createContext<Props>({
  searchedPhotos: {
    photos: [],
    page: 0,
    per_page: 0,
    total_results: 0,
    next_page: 0
  },
  setSearchedPhotos: () => {},
  photos:{
    photos: [],
    page: 0,
    per_page: 0,
    total_results: 0,
    next_page: 0
  },
  setPhotos:()=>{},
  loading:false,
  setLoading:()=>{},
  randomPhoto:{
    id: 0,
    width: 0,
    height: 0,
    url: "",
    alt: null,
    avg_color: null,
    photographer: "",
    photographer_url: "",
    photographer_id: "",
    liked: false,
    src: {
      original: "",
      large2x: "",
      large: "",
      medium: "",
      small: "",
      portrait: "",
      landscape: "",
      tiny: ""
    }
  } ,
  setRandomPhoto:()=>{}


});
