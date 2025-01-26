import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { fetchData, postBlog, updateBlog } from "./apiCalls";
import { useNavigate, useLocation } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "./Context";
import { deleteBlog } from "./apiCalls";

const ElementMap = {
  header: (data, id) => (
    <h1 key={id} className={`text-black font-bold text-[2rem]`}>
      {data.text}
    </h1>
  ),
  paragraph: (data, id) => (
    <p key={id} className={`text-gray-800`}>
      {data.text.split("<br>").join("")}
    </p>
  ),
  image: (data, id) => {
    return (
      <div
        key={id}
        className="w-[60vw] min-w-[10rem] max-w-[45rem] flex flex-col items-center"
      >
        <img className={`text-gray w-full`} src={data.file.url}></img>
        {data.caption.length !== 0 && (
          <p className="italic text-gray-800">
            {data.caption.split("<br>").join("")}
          </p>
        )}
      </div>
    );
  },
  // Embedding
  // List
};

const Preview = ({ props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location is:", location);

  let { setEdit, title, content, id, tags } = props;
  content.blocks = content.blocks.map((item) => {
    if (item.type === "text") {
      item.data.split("<br>").join("");
    }
    return item;
  });

  const { user } = useGlobalContext();
  console.log(content);

  const handlePost = async (blogID) => {
    if (!title || !content) {
      toast("Aren't you missing something?(hint: title or content)", {
        type: "warning",
        autoClose: 2000,
      });
    } else {
      let hello = toast.loading("Posting blog...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      let resp;
      if (id) {
        resp = await updateBlog({
          blogID,
          title,
          content: content.blocks,
          tags,
        });
      } else {
        resp = await postBlog({
          title,
          content: content.blocks,
          tags,
        });
        console.log("We reacherd here");
      }

      if (!resp) {
        toast.update(hello, {
          render: "something went wrong",
          type: "failure",
          autoClose: 1000,
          isLoading: false,
        });
      } else {
        toast.update(hello, {
          render: "Blog Posted",
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
        setTimeout(() => {
          console.log(123);
          id ? window.location.reload() : navigate("/blog/" + resp._id);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex w-[90vw] min-h-[80vh] mx-auto justify-evenly gap-4">
      <div className=" flex-1 flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className={`text-black font-bold text-[3rem]`}>
            {title || "This is the title of the post"}
          </h1>
          <div className="flex items-center mb-2">
            <h1 className="bg-black text-white rounded-lg p-1 font-bold px-2 ">
              Tags
            </h1>
            <div className="flex-1 flex justify-start">
              {tags?.map((el) => (
                <h1
                  className="ml-2 text-black font-bold hover:underline cursor-pointer"
                  onClick={() => navigate("/filter?tags=" + el)}
                >
                  {"#" + el}
                </h1>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden w-[2.5rem] bg-red-300">
              <img src={user.avatar} alt="" />
            </div>
            <h1 className="text-[1.1rem]  ">{user.name || "Author's name"}</h1>
            <div className="flex items-center gap-1 cursor-pointer">
              <FaRegHeart />
              <span>14</span>
            </div>
          </div>
        </div>
        {content &&
          content.blocks &&
          content.blocks.length &&
          content.blocks.map((item, index) => {
            return (
              <div key={index}>
                {ElementMap[`${item.type}`](item.data, item.id)}
              </div>
            );
          })}
      </div>
      <div className="w-[25vw] flex flex-col gap-3 p-5 ">
        <button
          className="bg-white hidden md:block border-black border-[2px] border-solid rounded-full text-black font-bold px-4 p-2"
          onClick={() => {
            setEdit(true);
          }}
        >
          Back to Editing
        </button>
        <button
          className="bg-white md:hidden min-w-[5rem] border-black border-[2px] border-solid rounded-full text-black font-bold px-4 p-2"
          onClick={() => {
            setEdit(true);
          }}
        >
          Edit
        </button>
        <button
          className="bg-black min-w-[5rem] rounded-full text-white font-bold px-4 p-2"
          onClick={() => {
            handlePost(id);
          }}
        >
          {id ? "Update" : "Post"}
        </button>
        {id ? (
          <button
            className="bg-red-700 min-w-[5rem] rounded-full text-white font-bold px-4 p-2"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
        ) : null}
      </div>
      <div //do not delete this is required
        id="editorjs"
        className="hidden"
      ></div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Preview;
