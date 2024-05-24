"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Navbar from "../Navbar/Navbar";
import SearchComponent from "../SearchComponent/SearchComponent";
import { useMediaContext } from "@/app/Context/MediaContext";
import { getPexelsClient } from "@/app/utils/getPexelsClient";

const Header = () => {
  const context = useMediaContext();
  const client = getPexelsClient();
  const [loading, setLoading] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isDotsCklicked, setIsDotsCklicked] = useState<boolean>(false);


  useEffect(() => {
    const fetchRandomPhoto = async () => {
      setLoading(true);
      try {
        const randomPage = Math.floor(Math.random() * 100) + 1; // Adjust the range as needed

        const response = await client.photos.curated({
          page: randomPage,
          per_page: 1,
        });

        if ("photos" in response && response.photos.length > 0) {
          context.setRandomPhoto(response.photos[0]);
        }
      } catch (error) {
        console.error("Error fetching random photo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerStyle = {
    backgroundImage: context.randomPhoto
      ? `url(${context.randomPhoto.src.landscape})`
      : "none",
  };

  return (
    <>
      <div className={styles.header} style={headerStyle}>
        <Navbar isDropdownVisible={isDropdownVisible} setIsDropdownVisible={setIsDropdownVisible} isDotsCklicked={isDotsCklicked} setIsDotsCklicked={setIsDotsCklicked} />

        <div className={styles.info}>
          <p>
            The best free stock photos, royalty free images & videos shared by
            creators.
          </p>
          <SearchComponent query={context.query} setQuery={context.setQuery} />
          <div className={styles.photographerContainer}>
            <span className={styles.photoBy}>Photo by</span>
            <span className={styles.photographer}>
              {context.randomPhoto && context.randomPhoto.photographer}
            </span>
          </div>
        </div>
      </div>
      {loading && (
        <div className={styles["placeholder-overlay"]}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </>
  );
};

export default Header;
