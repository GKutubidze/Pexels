import { VideoFile } from "../Types";

export const getHighestResolutionVideo = (videoFiles: VideoFile[]): VideoFile => {
    return videoFiles.reduce((highest, file) => {
      if (file.height && highest.height) {
        return file.height > highest.height ? file : highest;
      }
      return highest;
    }, videoFiles[0]);
  };