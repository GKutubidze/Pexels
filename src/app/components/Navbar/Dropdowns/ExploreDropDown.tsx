"use client";
import React, { useEffect, useRef } from "react";
import styles from "./ExploreDropDown.module.css";
function ExploreDropDown({
  setIsDropdownVisible,
}: {
  setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (exploreRef.current) {
        const { left, top, width, height } = exploreRef.current.getBoundingClientRect();
        const distanceX = e.clientX - (left + width / 2);
        const distanceY = e.clientY - (top + height / 2);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const radius = 200;  
        setIsDropdownVisible(distance <= radius);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setIsDropdownVisible]);

  
  return (
    <div className={styles.dropdown} ref={exploreRef}>
      {dropdownItems.map((item, index) => (
        <p key={index} className={styles.item}>{item.name}</p>
      ))}
    </div>
  );
}

export default ExploreDropDown;

const dropdownItems = [
  { name: "Discover Photos", link: "" },
  { name: "Popular Searches", link: "" },
  { name: "Leaderboard", link: "" },
  { name: "Challenges", link: "" },
  { name: "Free Videos", link: "" },
  { name: "Pexels Blog", link: "" },
];
