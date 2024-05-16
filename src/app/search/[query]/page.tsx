'use client'
import { MyContext } from "@/app/Context";
import React, { useContext } from "react";

const Page = ({params}: {params: {query: string}}) => {
  const context = useContext(MyContext);
  
  return <div>{params.query}
  {
    context.searchedPhotos.photos.map((item,key)=>{
      return (
        <p key={key}>{item.src.medium}</p>
      )
    })
  }
  </div>;
};

export default Page;
