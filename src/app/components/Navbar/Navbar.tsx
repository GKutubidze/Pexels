import React from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import menu from "../../../../public/menu.svg";
const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <Image src={logo} alt="logo" />

      <div className={styles.menuContainer}>
        <button className={styles.join}>Join</button>
        <Image src={menu} alt="menu" className={styles.menu} />
      </div>
    </div>
  );
};

export default Navbar;
