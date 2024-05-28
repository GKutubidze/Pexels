"use client";
import styles from "./Navbar.module.css";
import Image from "next/image";
import logo from "../../../../public/images/logo.png";
import menu from "../../../../public/images/menu.svg";
import { ConditionalDots } from "./Dropdowns/ConditionalDots";
import ExploreDropDown from "./Dropdowns/ExploreDropDown";
import icon from "../../../../public/images/arrow-down.svg";
import dots from "../../../../public/images/dots.svg";
import supabaseBrowser from "@/app/utils/supabase/supabaseBrowser";
import useAuth from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";
import { handleLogIn, handleLogOut } from "@/app/utils/authUtils";

type Props = {
  isDropdownVisible: boolean;
  setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isDotsCklicked: boolean;
  setIsDotsCklicked: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = (props: Props) => {
  const {
    isDropdownVisible,
    setIsDotsCklicked,
    isDotsCklicked,
    setIsDropdownVisible,
  } = props;
  const user = useAuth();
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogOut, 1000 * 60 * 60);
    };

    const handleUserActivity = () => {
      resetTimeout();
    };

    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    document.addEventListener("click", handleUserActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
    };
  }, []);

  return (
    <div className={styles.navbar}>
      <Image src={logo} alt="logo" />

      <div className={styles.menuContainerMobile}>
        {user ? (
          <button className={styles.join} onClick={handleLogOut}>
            Log out
          </button>
        ) : (
          <button className={styles.join} onClick={handleLogIn}>
            Join
          </button>
        )}
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
        {user ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt=""
            width={30}
            height={30}
            style={{ borderRadius: "50%" }}
          />
        ) : null}

        {user ? (
          <button className={styles.join} onClick={handleLogOut}>
            Log out
          </button>
        ) : (
          <button className={styles.join} onClick={handleLogIn}>
            Join
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
