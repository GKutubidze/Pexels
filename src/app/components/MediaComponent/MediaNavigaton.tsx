 import styles from './MediaNavigaton.module.css';
import {  useMediaContext } from '@/app/Context/MediaContext';
import { MediaType } from '@/app/Types';

 
interface DataItem {
  name: MediaType;
}

const MediaNavigaton = () => {
  const context=useMediaContext()

  const handleClick = (itemName: MediaType) => {
    context.setMediaType(itemName);
    context.setQuery("");
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
    name: 'Liked',
  },
];
