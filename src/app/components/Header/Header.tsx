'use client'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import styles from "./Header.module.css";
import Navbar from "../Navbar/Navbar";
import SearchComponent from "../SearchComponent/SearchComponent";
import { createClient, Photo } from "pexels";
import { DesktopNavbar } from "../Navbar/DesktopNavbar";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { MyContext } from "@/app/Context";

type Props = {
  query:string,
  setQuery:Dispatch<SetStateAction<string>>
};

const Header = ({ query,setQuery }: Props) => {
  const context=useContext(MyContext);
  const width=useWindowWidth();
  const apiKey =process.env.NEXT_PUBLIC_API_KEY as string;

  const client = createClient(apiKey);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomPhoto = async () => {
      setLoading(true);
      try {
        // Generate a random page number
        const randomPage = Math.floor(Math.random() * 100) + 1; // Adjust the range as needed
  
        // Fetch a random photo from the random page
        const response = await client.photos.curated({ page: randomPage, per_page: 1 });
  
        if ('photos' in response && response.photos.length > 0) {
          context.setRandomPhoto(response.photos[0]);
        }
      } catch (error) {
        console.error("Error fetching random photo:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Call the fetchRandomPhoto function whenever context.randomPhoto changes
    fetchRandomPhoto();
  }, []);
  

  const headerStyle = {
    backgroundImage: context.randomPhoto ? `url(${context.randomPhoto.src.landscape})` : "none",
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
              {context.randomPhoto && context.randomPhoto.photographer}
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
