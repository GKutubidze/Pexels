import React, { memo, useContext } from 'react'
import styles from "./ImagesContainer.module.css"
import Image from 'next/image'
import download from "../../../../public/download.svg"
import { MediaContext } from '@/app/Context/Context'
import { PhotosWithTotalResults } from 'pexels'


type Props ={
    photos: PhotosWithTotalResults
}

const ImagesContainer = (props:Props) => {
    const {photos}=props;
    const context=useContext(MediaContext)
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
