 import styles from './MediaNavigaton.module.css';
import {  useMediaContext } from '@/app/Context/MediaContext';
import useAuth from '@/app/hooks/useAuth';
import { MediaType } from '@/app/Types';

 
interface DataItem {
  name: MediaType;
}

const MediaNavigaton = () => {
  const context=useMediaContext()
  const user = useAuth();

  const handleClick = (itemName: MediaType) => {
    context.setMediaType(itemName);
    context.setQuery("");

  };

  const isLiked=("Liked" === context.mediaType)

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


          {
            user ?<div
           
            className={`${styles.item} ${isLiked ? styles.selected : ''}`}
            onClick={() => handleClick("Liked")}
          >
            <p className={`${styles.itemText} ${isLiked ? styles.selected : ''}`}>Liked</p>
          </div>:null
          }
          
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
  }
 
];
