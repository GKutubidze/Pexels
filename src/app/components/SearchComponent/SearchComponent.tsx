"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import Image from "next/image";
import styles from "./SearchComponent.module.css";
import ConditionalBoard from "./CondtionalBoard";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { useMediaContext } from "@/app/Context/MediaContext";
 
type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};
const SearchComponent = ({ query, setQuery }: Props) => {
  const context = useMediaContext();
  const width = useWindowWidth();
  const [isArrowDown, setIsArrowDown] = useState<boolean>(true);
  const [showConditionalBoard, setShowConditionalBoard] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(" ");
 

  const handleClicked=()=>{
    setQuery(searchText.trim());
    if(context.searchType=="Photos"){
      context.setMediaType("Home")
    }
    else if(context.searchType=="Videos"){
      context.setMediaType("Videos")
    }


  }

  return (
    <div className={styles.searchComponent}>
      {(!isArrowDown || showConditionalBoard) && (
        <ConditionalBoard setShowConditionalBoard={setShowConditionalBoard} />
      )}
      <div className={styles.inputWrapper}>
        <div
          className={styles.iconWrapper}
          onMouseEnter={() => {
            setIsArrowDown(false);
          }}
          onMouseLeave={() => {
            setIsArrowDown(true);
          }}
        >
          {context.searchType === "Photos" ? (
            <Image src="/images/picture-icon.svg" alt="video" width={20} height={20} />
          ) : (
            <Image src="/images/video-icon.svg" alt="video" width={20} height={20} />
          )}

          {width > 375 && (
            <>
              {context.searchType == "Photos" ? (
                <p style={{ fontSize: "16px", color: "black" }}>Photos</p>
              ) : (
                <p
                  className={styles.media}
                  style={{ fontSize: "16px", color: "black" }}
                >
                  Videos
                </p>
              )}
            </>
          )}

          {isArrowDown ? (
            <Image
              src="/images/icon-down.svg"
              alt="Arrow Icon"
              width={10}
              height={10}
            />
          ) : (
            <Image src="/images/icon-up.svg" alt="Arrow Icon" width={10} height={10} />
          )}
        </div>
        <input
          type="text"
          placeholder="Search for free photos"
          className={styles.inputField}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          
          value={searchText}
          onKeyDown={(e)=>{
            if(e.key=="Enter"){
              setQuery(searchText.trim());
              context.setMediaType("");
            }
          }}
        />

        <div className={styles.searchIconWrapper}>
          <Image
            src="/images/icon-search.svg"
            alt="Search Icon"
            width={25}
            height={25}
            onClick={handleClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
