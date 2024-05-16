'use client'
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Navbar from "../Navbar/Navbar";
import SearchComponent from "../SearchComponent/SearchComponent";
import { Photo } from "pexels";
import { DesktopNavbar } from "../Navbar/DesktopNavbar";

type Props = {
  randomPhoto: Photo | undefined;
};

const Header = ({ randomPhoto }: Props) => {
  const isClientSide = typeof window !== 'undefined';
  const isMobile = isClientSide && window.innerWidth < 768;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (randomPhoto) {
      setLoading(false);
    }
  }, [randomPhoto]);

  const headerStyle = {
    backgroundImage: randomPhoto ? `url(${randomPhoto.src.landscape})` : "none",
  };

  return (
    <>
      <div className={styles.header} style={headerStyle}>
        {isMobile ? <Navbar /> : <DesktopNavbar />}

        <div className={styles.info}>
          <p>
            The best free stock photos, royalty free images & videos shared by creators.
          </p>
          <SearchComponent />
          <div className={styles.photographerContainer}>
            <span className={styles.photoBy}>Photo by</span>
            <span className={styles.photographer}>
              {randomPhoto && randomPhoto.photographer}
            </span>
          </div>
        </div>
      </div>
      {/* Conditionally render loading indicator */}
      {isClientSide && loading && (
        <div className={styles['placeholder-overlay']}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </>
  );
};

export default Header;
