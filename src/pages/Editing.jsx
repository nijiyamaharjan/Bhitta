import React, { useState, useEffect } from "react";

import EditBlog from "../components/EditBlog";
import Preview from "../components/Preview";
import axios from "axios";
import { baseUrl } from "../components/apiCalls";

const Editing = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [myImg, setMyImg] = useState("");
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      console.error("No files selected.");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }
    console.log(formData);
    try {
      const res = await axios.post(
        // "https://bhitta.onrender.com/image/upload/",
        `${baseUrl}/image/upload`,
        // "http://localhost:6173/image/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // const res = await axios.get("http://localhost:6173/blogs/all")
      console.log(res.data.image._id);
      const imgResponse = await fetch(
        // "https://bhitta.onrender.com/image/" +
        `${baseUrl}/image/`+
          // "http://localhost:6173/image/" +
          res.data.image._id
      );
      const blobData = await imgResponse.blob();
      console.log("Blob Data:", blobData);

      const url = URL.createObjectURL(blobData);
      console.log("Blob URL:", url);
      setMyImg(url);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  return (
    <div className="block">
      {isEditing ? <EditBlog></EditBlog> : <Preview />}
      {/* <div className='block my-[20rem] mx-auto w-20'>
        <input type="file" name="images"  onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Images</button>
      </div>
      {myImg&&<div className='py-3 bg-red-500'>
        <img src={myImg} alt="" className='w-full h-full'/>
      </div>} */}
    </div>
  );
};

export default Editing;
