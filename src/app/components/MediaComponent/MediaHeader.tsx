'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from './MediaHeader.module.css';
import icon from '../../../../public/icon-down.svg';
import up from '../../../../public/icon-up.svg';
import correct from '../../../../public/correct.svg';
import Image from 'next/image';

const MediaHeader = ({title}:{title:string}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('Trending');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <p>{title}</p>
      </div>
      <div className={styles.trendingContainer} onClick={toggleDropdown} ref={dropdownRef}>
        <p>{selectedOption}</p>
        {!isDropdownOpen ? <Image src={icon} alt='' /> : <Image src={up} alt='' />}
        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            <div onClick={() => handleOptionClick('Trending')} className={styles.child}>
              Trending {selectedOption === 'Trending' && <Image src={correct} alt='' />}
            </div>
            <div onClick={() => handleOptionClick('New')} className={styles.child}>
              New {selectedOption === 'New' && <Image src={correct} alt='' />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaHeader;
