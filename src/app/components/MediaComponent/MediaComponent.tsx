import React, { Dispatch, SetStateAction, useContext } from "react";
import styles from "./MediaComponent.module.css";
 import MediaNavigaton from "./MediaNavigaton";
 
import MediaContent from "../MediaContent/MediaContent";

export default function MediaComponent() {
 
  return (
    <div className={styles.main}>
      <MediaNavigaton />
      <MediaContent />
    </div>
  );
}
