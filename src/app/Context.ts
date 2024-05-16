'use client'
import { createContext, Dispatch, SetStateAction } from "react";
import { PhotosWithTotalResults } from "pexels";

export interface Props {
  searchedPhotos: PhotosWithTotalResults;
  setSearchedPhotos: Dispatch<SetStateAction<PhotosWithTotalResults>>;
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
  setSearchedPhotos: () => {} // Placeholder function
});
