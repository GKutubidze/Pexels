"use client";
import React, { useState } from "react";
import styles from "./DesktopNavbar.module.css";
import Image from "next/image";
import logo from "../../../../public/images/temp.png";
import icon from "../../../../public/images/arrow-down.svg";
import dots from "../../../../public/images/dots.svg";
import ExploreDropDown from "./Dropdowns/ExploreDropDown";
import { ConditionalDots } from "./Dropdowns/ConditionalDots";
export const DesktopNavbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isDotsCklicked, setIsDotsCklicked] = useState<boolean>(false);

  return (
    <div className={styles.main}>
      <Image src={logo} alt="logo" />

      <div className={styles.menuContainer}>
        <div
          className={styles.explore}
          onMouseEnter={() => setIsDropdownVisible(true)}
          // onMouseLeave={() => setIsDropdownVisible(false)}
        >
          <p className={styles.title}>Explore</p>

          <Image src={icon} alt="" />
          {isDropdownVisible && (
            <ExploreDropDown setIsDropdownVisible={setIsDropdownVisible} />
          )}
        </div>
        <div className={styles.license}>
          <p className={styles.title}>License</p>
        </div>
        <div className={styles.upload}>
          <p className={styles.title}>Upload</p>
        </div>

        <div
          className={styles.dots}
          onMouseEnter={() => setIsDotsCklicked(true)}
        >
          <Image src={dots} alt="" />

          {isDotsCklicked && (
            <ConditionalDots setIsDotsCklicked={setIsDotsCklicked} />
          )}
        </div>

        <button className={styles.join}>Join</button>
      </div>
    </div>
  );
};
