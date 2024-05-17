'use client'
import { MediaContext } from '@/app/Context/MediaContext'
import { getPexelsClient } from '@/app/utils/getPexelsClient'
import { PhotosWithTotalResults } from 'pexels'
import React, { useContext, useEffect, useState } from 'react'
import styles from "./VideosContainer.module.css"
import download from "../../../../public/download.svg"
import Image from 'next/image'

const VideosContainer = () => {
    const [page, setPage] = useState<number>(1);
    const context=useContext(MediaContext);

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
    const client=getPexelsClient();
    
useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        context.setLoading(true);
        try {
          const response = await client.videos.popular({ per_page: 10, page });
          if ('videos' in response) {
            context.setVideos((prevVideos) => ({
              ...prevVideos,
              page: response.page,
              per_page: response.per_page,
              total_results: response.total_results,
              url: response.url,
              videos: [...prevVideos.videos, ...response.videos],
            }));
            setPage((prevPage) => prevPage + 1);
          } else {
             console.error('Error response:', response);
          }
        } catch (error) {
           console.error('Error:', error);
        } finally {
          context.setLoading(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [context, client, page]);  
     
  return (
    <div className={styles.videosContainer}>
      {context.videos.videos.map((video) => (
        
        <div key={video.id} className={styles.videoWrapper}>
            <div className={styles.overlay} key={video.id}>
            <Image src={download} alt="" onClick={() => handleDownload(video.url)}/>

           </div>
          <video
            src={video.video_files[0].link}
            width="100%"
            height={video.height}
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
            muted
            loop
            className={styles.video}
          />
        </div>
      ))}
    </div>
  );
};


export default VideosContainer