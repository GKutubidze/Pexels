'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./Header.module.css";
import Navbar from "../Navbar/Navbar";
import SearchComponent from "../SearchComponent/SearchComponent";
import { Photo } from "pexels";
import { DesktopNavbar } from "../Navbar/DesktopNavbar";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";

type Props = {
  randomPhoto: Photo | undefined;
  query:string,
  setQuery:Dispatch<SetStateAction<string>>
};

const Header = ({ randomPhoto,query,setQuery }: Props) => {
  const width=useWindowWidth();
 
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
        {width<768 ? <Navbar /> : <DesktopNavbar />}

        <div className={styles.info}>
          <p>
            The best free stock photos, royalty free images & videos shared by creators.
          </p>
          <SearchComponent query={query} setQuery={setQuery} />
          <div className={styles.photographerContainer}>
            <span className={styles.photoBy}>Photo by</span>
            <span className={styles.photographer}>
              {randomPhoto && randomPhoto.photographer}
            </span>
          </div>
        </div>
      </div>
      {/* Conditionally render loading indicator */}
      { loading && (
        <div className={styles['placeholder-overlay']}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </>
  );
};

export default Header;
