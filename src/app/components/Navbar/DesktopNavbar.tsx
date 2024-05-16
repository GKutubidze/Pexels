import React from "react";
import styles from "./DesktopNavbar.module.css";
import Image from "next/image";
import logo from "../../../../public/temp.png";
import icon from "../../../../public/arrow-down.svg";
import dots from "../../../../public/dots.svg";
export const DesktopNavbar = () => {
  return (
    <div className={styles.main}>
      <Image src={logo} alt="logo" />

      <div className={styles.menuContainer}>
        <div className={styles.explore}>
          <p>Explore</p>

          <Image src={icon} alt="" />
        </div>
        <div className={styles.license}>
          <p>License</p>
        </div>
        <div className={styles.upload}>
          <p>Upload</p>
        </div>
        <Image src={dots} alt="" />

        <button className={styles.join}>Join</button>
      </div>
    </div>
  );
};
