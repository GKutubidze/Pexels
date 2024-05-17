'use client'
import React, { memo, useContext, useEffect, useState } from 'react'
import styles from "./ImagesContainer.module.css"
import Image from 'next/image'
import download from "../../../../public/download.svg"
import { MediaContext } from '@/app/Context/MediaContext'
import { PhotosWithTotalResults } from 'pexels'
import { getPexelsClient } from '@/app/utils/getPexelsClient'


type Props ={
    photos: PhotosWithTotalResults
}

const ImagesContainer = (props:Props) => {
    const {photos}=props;
    const context=useContext(MediaContext)
    const [page, setPage] = useState<number>(1);
    const client =getPexelsClient();

    const handleImageLoad = () => {
        context.setLoading(false); // Update loading state when image is loaded
        console.log("Image loaded successfully");
      };


  const handleDownload = (url: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(new Blob([blob]));
  
        // Create an anchor element
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "image.jpg"; // You can set the desired file name here
        link.click();
  
        // Clean up
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => console.error('Download failed', error));
  };

  useEffect(() => {
    const handleScroll = () => {

      const fetchPhotos = async () => {
        context.setLoading(true);
        try {
          const response = await client.photos.curated({ page, per_page: 15 });
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className={styles.photosContainer}>
        {photos.photos.map((photo) => (
          <div key={photo.id} className={styles.photoWrapper}>

          <div className={styles.overlay} key={photo.id}>
           <Image src={download} alt="" onClick={() => handleDownload(photo.src.original)}/>
          </div>
          
            <Image
              src={photo.src.original}
              alt=""
              width={photo.width}
              height={photo.height}
              className={styles.photo}
              layout="responsive"
              onLoad={handleImageLoad}
              priority
            />
          </div>
        ))}
      </div>
  )
}

export default memo(ImagesContainer);
