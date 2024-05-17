'use client'
import { MediaContext } from '@/app/Context/Context'
import { getPexelsClient } from '@/app/utils/getPexelsClient'
import { PhotosWithTotalResults } from 'pexels'
import React, { useContext, useEffect, useState } from 'react'
import styles from "./VideosContainer.module.css"

const VideosContainer = () => {
    const [page, setPage] = useState<number>(1);
    const context=useContext(MediaContext);

    const client=getPexelsClient();
console.log(context.videos)
   
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
            // Handle error response
            console.error('Error response:', response);
          }
        } catch (error) {
          // Handle network errors or other exceptions
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
  }, [context, client, page]); // Added context, client, and page as dependencies
     
  return (
    <div className={styles.videosContainer}>
      {context.videos.videos.map((video) => (
        <div key={video.id} className={styles.videoWrapper}>
          <video
            src={video.video_files[0].link}
            width="100%"
            height="auto"
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