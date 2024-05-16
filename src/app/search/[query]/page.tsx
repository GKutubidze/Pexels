'use client'
import { MyContext } from "@/app/Context";
import React, { useContext } from "react";

const Page = ({params}: {params: {query: string}}) => {
  const context = useContext(MyContext);
  console.log(context.searchedPhotos)
  return <div>{params.query}
 
     
  </div>;
};

export default Page;
