"use client";
import React, { useEffect, useRef } from "react";
import styles from "./ConditionalBoard.module.css";
import Image from "next/image";
import { useMediaContext } from "@/app/Context/MediaContext";

type Props = {
  setShowConditionalBoard: React.Dispatch<React.SetStateAction<boolean>>;
};
const ConditionalBoard = ({ setShowConditionalBoard }: Props) => {
  const context = useMediaContext();
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

        const radius = 80;
        setShowConditionalBoard(distance <= radius);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setShowConditionalBoard]);
  return (
    <div
      className={styles.main}
    
      ref={exploreRef}
    >
      <div className={styles.pictureContainer}>
        <Image src="/picture-icon.svg" alt="picture" width={20} height={20} />
        <p
          onClick={() => {
            context.setSearchType("Photos");
            context.setMediaType("Home");
          }}
          style={
            context.searchType === "Photos"
              ? { color: "green" }
              : { color: "black" }
          }
        >
          Photos
        </p>
      </div>

      <div className={styles.videoContainer}>
        <Image src="/video-icon.svg" alt="vidoe" width={20} height={20} />
        <p
          onClick={() => {
            context.setSearchType("Videos");
            context.setMediaType("Videos");
          }}
          style={
            context.searchType === "Videos"
              ? { color: "green" }
              : { color: "black" }
          }
        >
          Videos
        </p>
      </div>
    </div>
  );
};

export default ConditionalBoard;
