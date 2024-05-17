import React, { useContext } from 'react';
import styles from './MediaNavigaton.module.css';
import { MediaContext } from '@/app/Context/MediaContext';

type MediaType = "Home" | "Videos" | 'Challenges';

interface DataItem {
  name: MediaType;
}

const MediaNavigaton = () => {
  const context = useContext(MediaContext);

  const handleClick = (itemName: MediaType) => {
    context.setMediaType(itemName);
  };

  return (
    <div className={styles.main}>
      {Data.map((item: DataItem, key: number) => {
        const isSelected = item.name === context.mediaType;
        return (
          <div
            key={key}
            className={`${styles.item} ${isSelected ? styles.selected : ''}`}
            onClick={() => handleClick(item.name)}
          >
            <p className={`${styles.itemText} ${isSelected ? styles.selected : ''}`} >{item.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MediaNavigaton;

const Data: DataItem[] = [
  {
    name: 'Home',
  },
  {
    name: 'Videos',
  },
  {
    name: 'Challenges',
  },
];
