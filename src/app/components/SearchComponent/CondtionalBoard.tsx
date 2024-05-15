import React from "react";
import styles from "./ConditionalBoard.module.css";
import Image from "next/image";

type Props = {
  setShowConditionalBoard: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPictureClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVideoClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isPictureClicked: boolean;
  isVideoClicked: boolean;
};
const ConditionalBoard = ({
  setShowConditionalBoard,
  setIsPictureClicked,
  setIsVideoClicked,
  isPictureClicked,
  isVideoClicked,
}: Props) => {
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
            setIsPictureClicked(true);
            setIsVideoClicked(false);
          }}

          style={isPictureClicked ? {color:"green"} :{color:"black"}}
        >
          Photos
        </p>
      </div>

      <div className={styles.videoContainer}>
        <Image src="/video-icon.svg" alt="vidoe" width={20} height={20} />
        <p
          onClick={() => {
            setIsPictureClicked(false);
            setIsVideoClicked(true);
          }}
          style={isVideoClicked ? {color:"green"} :{color:"black"}}

        >
          Videos
        </p>
      </div>
    </div>
  );
};

export default ConditionalBoard;
