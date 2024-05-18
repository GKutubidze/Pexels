'use client'
import {   useMediaContext } from '@/app/Context/MediaContext'
import { getPexelsClient } from '@/app/utils/getPexelsClient'
import { PhotosWithTotalResults } from 'pexels'
import React, { useContext, useEffect, useState } from 'react'
import styles from "./VideosContainer.module.css"
import download from "../../../../public/download.svg"
import Image from 'next/image'
import MediaHeader from './MediaHeader'

const VideosContainer = () => {
    const [page, setPage] = useState<number>(1);
    const context=useMediaContext()

 
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

    <div>
      <MediaHeader title='Trending Free Stock Videos'/>
      <div className={styles.videosContainer}>
      
      {context.videos.videos.map((video) => (
       
       <div key={video.id} className={styles.videoWrapper}>
           <div className={styles.overlay} key={video.id}>
           <Image src={download} alt="" onClick={() => window.open(video.video_files[0].link, '_blank')}/>

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
    </div>
   
  );
};


export default VideosContainer