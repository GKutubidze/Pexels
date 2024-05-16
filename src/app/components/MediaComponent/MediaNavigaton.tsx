import React, { useState } from 'react';
import styles from './MediaNavigaton.module.css';

const MediaNavigaton = () => {
  const [selectedItem, setSelectedItem] = useState<string>('Home');

  const handleClick = (itemName:string) => {
    setSelectedItem(itemName);
  };

  return (
    <div className={styles.main}>
      {Data.map((item, key) => {
        const isSelected = item.name === selectedItem;
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

const Data = [
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
