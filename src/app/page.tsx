"use client";
import Header from "./components/Header/Header";
import styles from "./page.module.css";
import {
  Photo,
  PhotosWithTotalResults,
  ErrorResponse,
  createClient,
} from "pexels";
 
import { useState, useEffect, useRef, useContext } from "react";
import MediaComponent from "./components/MediaComponent/MediaComponent";
import { MediaContext } from "./Context/Context";

export default function Home() {
  const context=useContext(MediaContext)
  const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;
  const client = createClient(apiKey);
  const [page, setPage] = useState<number>(1);


 
  // Attach scroll event listener when component mounts
  useEffect(() => {
    const handleScroll = () => {

      const fetchPhotos = async () => {
        context.setLoading(true);
        try {
          const response = await client.photos.curated({ page, per_page: 10 });
          if ("photos" in response) {
            context.setPhotos((prevPhotos) => ({
              ...prevPhotos,
              photos: [...prevPhotos.photos, ...response.photos],
              page: response.page,
              per_page: response.per_page,
            }));
            setPage((prevPage) => prevPage + 1);
          } else {
            // Handle error response
            console.error("Error response:", response);
          }
        } catch (error) {
          // Handle network errors or other exceptions
          console.error("Error:", error);
        } finally {
          context.setLoading(false);
        }
      };
        if (
          window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight
        ) {
          fetchPhotos();
        }
      };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className={styles.main}>
      <Header  />
      <MediaComponent />
    </main>
  );
}
