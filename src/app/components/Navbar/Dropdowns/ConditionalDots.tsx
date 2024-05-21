"use client";
import React, { useEffect, useRef } from "react";
import styles from "./ConditionalDots.module.css";
export const ConditionalDots = ({
  setIsDotsCklicked,
}: {
  setIsDotsCklicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (exploreRef.current) {
        const { left, top, width, height } =
          exploreRef.current.getBoundingClientRect();
        const distanceX = e.clientX - (left + width / 2);
        const distanceY = e.clientY - (top + height / 2);
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );

        const radius = 250; // Set your desired radius here
        setIsDotsCklicked(distance <= radius);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setIsDotsCklicked]);

  return (
    <div className={styles.dropdown} ref={exploreRef}>
      <div className={styles.login}>
        {Login.map((item, key) => {
          return <p key={key}  className={styles.item}>{item.name}</p>;
        })}
      </div>

      <div className={styles.section}>
        {Sections.map((item, key) => {
          return <p key={key}  className={styles.item}>{item.name}</p>;
        })}
      </div>
    </div>
  );
};

const Sections = [
  { name: "Image & Video API", link: "" },
  { name: "Apps & Plugins", link: "" },
  { name: "FAQ", link: "" },
  { name: "Report Content", link: "" },
  { name: "Partnerships", link: "" },
  { name: "Imprint & Terms", link: "" },
];

const Login = [
  { name: "Login", link: "" },
  { name: "Join", link: "" },
  { name: "Change Language", link: "" },
];
