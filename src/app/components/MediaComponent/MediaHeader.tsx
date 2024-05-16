import React from 'react'
import styles from "./MediaHeader.module.css"
import icon from "../../../../public/icon-down.svg";
import Image from 'next/image';
const MediaHeader = () => {
  return (
    <div className={styles.header}>
        <div className={styles.title}>
        <p>Free Stock Photos</p>

        </div>
        <div className={styles.trendingContainer}>
            <p>Trending</p>
            <Image src={icon} alt=''/>
        </div>
      </div>
  )
}

export default MediaHeader