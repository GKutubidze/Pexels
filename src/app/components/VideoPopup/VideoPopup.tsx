import React from "react";
import styles from "./VideoPopup.module.css";
import { Video } from "@/app/Types";
import { getHighestResolutionVideo } from "@/app/utils/getHighestResolutionVideo";

interface Props {
  video: Video;
  setIsVideoClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoPopup: React.FC<Props> = ({ video, setIsVideoClicked }) => {
  const bestVideoFile = getHighestResolutionVideo(video.video_files);

  return (
    <div className={styles.overlay} onClick={() => setIsVideoClicked(false)}>
      <div className={styles.popup}>
        <video
          src={bestVideoFile.link}
          className={styles.video}
          controls
          autoPlay={false}
          controlsList="nodownload"
          disablePictureInPicture
        />
        <div className={styles.downloadButton}>
          <a href={bestVideoFile.link} download>
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
