import React from "react";
import styles from "./ConditionalBoard.module.css";
import Image from "next/image";
import { useMediaContext } from "@/app/Context/MediaContext";

type Props = {
  setShowConditionalBoard: React.Dispatch<React.SetStateAction<boolean>>;
};
const ConditionalBoard = ({ setShowConditionalBoard }: Props) => {
  const context = useMediaContext();

  return (
    <div
      className={styles.main}
      onMouseEnter={() => {
        setShowConditionalBoard(true); // Keep the conditional bar open when the mouse enters it
      }}
      onMouseLeave={() => {
        setShowConditionalBoard(false); // Close the conditional bar when the mouse leaves it
      }}
    >
      <div className={styles.pictureContainer}>
        <Image src="/picture-icon.svg" alt="picture" width={20} height={20} />
        <p
          onClick={() => {
            context.setSearchType("Photos");
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
