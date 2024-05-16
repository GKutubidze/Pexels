"use client";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./SearchComponent.module.css";
import ConditionalBoard from "./CondtionalBoard";
import { useWindowWidth } from "@/app/hooks/useWindowWidth";
import { useRouter } from "next/navigation";
import { MyContext } from "@/app/Context";
import { createClient } from "pexels";
 type Props={
  query:string,
  setQuery:Dispatch<SetStateAction<string>>

 }
const SearchComponent = ({query,setQuery}:Props) => {
  const context=useContext(MyContext);
  const router=useRouter();
  const width=useWindowWidth();
   const [isArrowDown, setIsArrowDown] = useState<boolean>(true);
  const [showConditionalBoard, setShowConditionalBoard] =
    useState<boolean>(false);
  const [media, setMedia] = useState<string>("Photos");
  const [isPictureClicked, setIsPictureClicked] = useState<boolean>(true);
  const [isVideoClicked, setIsVideoClicked] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(" ");
  const apiKey =process.env.NEXT_PUBLIC_API_KEY as string;

  const client = createClient(apiKey);
  console.log(query)

  const searchPhotos = async () => {
    context.setLoading(true);
    try {
      const response = await client.photos.search({
        query: searchText,
        page: context.photos.page + 1,
        per_page: 10
      });
      if ("photos" in response) {
        context.setSearchedPhotos((prevPhotos) => ({
          photos: [...prevPhotos.photos, ...response.photos],
          page: response.page,
          per_page: response.per_page,
          total_results: response.total_results,
          next_page: response.next_page
        }));
      } else {
        // Handle error response
        console.error("Error response:", response);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error:", error);
    } finally {
      context.setLoading(false);
    }
  };
  
   return (
    <div className={styles.searchComponent}>
      {(!isArrowDown || showConditionalBoard) && (
        <ConditionalBoard
          setShowConditionalBoard={setShowConditionalBoard}
          setIsPictureClicked={setIsPictureClicked}
          setIsVideoClicked={setIsVideoClicked}
          isPictureClicked={isPictureClicked}
          isVideoClicked={isVideoClicked}
        />
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
          {isPictureClicked ? (
            <Image src="/picture-icon.svg" alt="video" width={20} height={20} />
          ) : (
            <Image src="/video-icon.svg" alt="video" width={20} height={20} />
          )}

          {width<375 && (  
            <>
              {isPictureClicked ? (
                <p style={{ fontSize: "16px", color: "black" }}>Pictures</p>
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
              src="/icon-down.svg"
              alt="Arrow Icon"
              width={10}
              height={10}
            />
          ) : (
            <Image src="/icon-up.svg" alt="Arrow Icon" width={10} height={10} />
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
        />

        <div className={styles.searchIconWrapper}>
          <Image
            src="/icon-search.svg"
            alt="Search Icon"
            width={25}
            height={25}
            onClick={() => {
              setQuery(searchText);
              searchPhotos();
              router.push(`/search/${searchText}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
