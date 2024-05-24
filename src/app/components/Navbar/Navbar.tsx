'use client'
import React, { useState } from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import logo from "../../../../public/images/logo.png";
import menu from "../../../../public/images/menu.svg";
import { ConditionalDots } from "./Dropdowns/ConditionalDots";
import ExploreDropDown from "./Dropdowns/ExploreDropDown";
import icon from "../../../../public/images/arrow-down.svg";
import dots from "../../../../public/images/dots.svg";
const Navbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isDotsCklicked, setIsDotsCklicked] = useState<boolean>(false);

  return (
    <div className={styles.navbar}>
      <Image src={logo} alt="logo" />

      <div className={styles.menuContainerMobile}>
        <button className={styles.join}>Join</button>
        <Image src={menu} alt="menu" className={styles.menu} />
      </div>



      <div className={styles.menuContainerDesktop}>
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

export default Navbar;
