'use client'
 import Header from "./components/Header/Header";
import styles from "./page.module.css";
import {
  Photo,
  PhotosWithTotalResults,
  ErrorResponse,
  createClient,
  PaginationParams
} from "pexels";

import { useState, useEffect, useRef } from "react";
import MediaComponent from "./components/MediaComponent/MediaComponent";
   
export default function Home() {
 
  const apiKey =process.env.NEXT_PUBLIC_API_KEY as string;
  const client = createClient(apiKey);
  const perPage = 20;

  const [photos, setPhotos] = useState<PhotosWithTotalResults>({
    photos: [],
    page: 0,
    per_page: 0,
    total_results: 0,
    next_page: 0
     
  });
  const [page, setPage] = useState<number>(1);
   const [randomPhoto, setRandomPhoto] = useState<Photo[]>();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  
  useEffect(() => {
    const fetchRandomPhoto = async () => {
      try {
        const response = await client.photos.curated({ per_page: 1 });
        if ('photos' in response && response.photos.length > 0) {
          setRandomPhoto(response.photos);
        }
      } catch (error) {
        console.error("Error fetching random photo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPhoto();
  }, []);


  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await client.photos.curated({ page, per_page: 10 });
      if ("photos" in response) {
        setPhotos((prevPhotos) => ({
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);


  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchPhotos();
    }
  };

  // Attach scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


   
  
  return (
    <main className={styles.main}>
      <Header randomPhoto={randomPhoto} />
      <MediaComponent photos={photos} loading={loading} error={error} setLoading={setLoading} />
      
    </main>
  );
}





// const fetchPhotosByQuery = () => {
//   fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`, {
//     headers: {
//       Authorization: apiKey
//     }
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(data => {
//     setPhotos(data.photos);
//   })
//   .catch(error => {
//     setError(error.message);
//   });
// };




// const fetchPhotos = () => {
//   fetch(`https://api.pexels.com/v1/curated?page=${pageRef.current}&per_page=${perPage}`, {
//    headers: {
//      Authorization: apiKey
//    }
//  })
//  .then(response => {
//    setLoading(false)

//    if (!response.ok) {
//      throw new Error('Network response was not ok');
//    }
//    return response.json();
//  })
//  .then(data => {
//    setPhotos(prevPhotos => [...prevPhotos, ...data.photos]); // Append new photos to existing ones
//    // Update pageRef for the next fetch
//    pageRef.current = data.page + 1; // Increment the page for the next fetch
//  })
//  .catch(error => {
//    setError(error.message);
//  })
//  .finally(() => {
//    setLoading(true)
//   });
// };
