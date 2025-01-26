import React, { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { fetchBlog, updateBlog } from "../components/apiCalls";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import EditBlog from "../components/EditBlog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "../components/Context";
import { deleteBlog } from "../components/apiCalls";

const handleDeletePost = async (blogID) => {
  let hello = toast.loading("Deleting blog...", {
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
  if (blogID) {
    resp = await deleteBlog({ blogID });
  }

  console.log(resp);
  if (!resp) {
    console.log("nope");
  } else {
    console.log("deleted");
    setTimeout(() => {
      console.log(123);
      console.log(location.pathname);
    }, 1000);
  }
};

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
        className="w-[90vw] md:w-[60vw] min-w-[10rem] max-w-[45rem] flex flex-col items-center"
      >
        <img className={`text-gray w-full`} src={data.file.url}></img>
        {data.caption.length !== 0 && (
          <p className="italic text-gray-600">
            {data.caption.split("<br>").join("")}
          </p>
        )}
      </div>
    );
  },
};

const SingleBlog = () => {
  // const info = localStorage.getItem("info");
  // if(info){
  //   const {userID:self} = JSON.parse(info);
  // }

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const { blogID } = useParams();
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState("");
  const [blog, setBlog] = useState([]);
  const asyncWrapper = async () => {
    let temp = await fetchBlog(blogID);
    console.log(temp);
    setBlog(temp.blog);
    setLoading(false);
  };
  const handleComment = async (text) => {
    let hello = toast.loading("Posting Comment...", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    console.log(12312);
    const now = `${
      new Date().getMonth() + 1
    }/${new Date().getDate()} - ${new Date().getHours()}:${new Date().getMinutes()}`;
    if(!user||!user.name){
      console.log(12121)
      toast.update(hello, {
        render: "You need to be signed in to post comments",
        type: "failure",
        autoClose: 1000,
        isLoading: false,
      });
    }
    else{

      try {
        const comment = {
          text,
          createdBy: {
            name: user.name,
            pfp: user.avatar,
          },
          createdAt: now,
        };
        
        const updated = await updateBlog({
        blogID,
        ...blog,
        comments: [comment, ...blog.comments],
      });
      if (!updated) {
        toast.update(hello, {
          render: "Something went wrong",
          type: "failure",
          autoClose: 1000,
          isLoading: false,
        });
      } else {
        setBlog(updated.blog);
        toast.update(hello, {
          render: "Comment Posted",
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  };

  useEffect(() => {
    asyncWrapper();
  }, []);

  return (
    <div className="max-w-[90vw] mx-auto flex flex-col items-center">
      {loading ? (
        <div className=" h-[60vh] ">
          <img src="https://raw.githubusercontent.com/nijiyamaharjan/Bhitta/main/public/loading.gif" alt="" />
        </div>
      ) : edit ? (
        <EditBlog props={blog} />
      ) : (
        <div className="min-h-[60vh] flex w-[90vw] md:w-[60%] mx-auto justify-evenly gap-0 md:gap-4 py-4 md:px-24">
          <div className=" flex-1 flex flex-col gap-6">
            <div className="flex flex-col">
              {user && user._id && blog.createdBy.id === user._id && (
                <div className="md:hidden w-[90vw] flex gap-3 justify-center ">
                  <button
                    className="bg-white border-black border-[1px] md:border-[2px] border-solid min-w-[5rem] md:min-w-[10rem] rounded-full text-black text-sm md:text-lg font-bold px-4 p-[0.125rem]  md:p-2"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    Edit Blog
                  </button>
                  <button
                    className="bg-red-600 min-w-[5rem] md:min-w-[10rem] text-sm md:text-lg  rounded-full text-white font-bold px-4 p-2"
                    onClick={() => {
                      handleDeletePost(blogID);
                      setTimeout(() => {
                        navigate("/blog");
                        window.location.reload();
                      }, 1500);
                    }}
                  >
                    Delete Blog
                  </button>
                </div>
              )}
              <h1
                className={`text-gray-900 font-bold text-[2rem] leading-8 md:leading-10 my-2 md:text-[3rem]`}
              >
                {blog.title || "This is the title of the post"}
              </h1>
              <div className="flex items-center mb-2">
                <h1 className="bg-black text-white rounded-lg p-1 font-bold px-2 ">
                  Tags
                </h1>
                <div className="flex-1 flex justify-start">
                  {blog.tags?.map((el, index) => (
                    <h1
                      key={index}
                      className="ml-2 text-black font-bold hover:underline cursor-pointer"
                      onClick={() => navigate("/filter?tags=" + el)}
                    >
                      {"#" + el}
                    </h1>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full overflow-hidden w-[2rem] bg-red-300">
                  <img src={blog.createdBy && blog.createdBy.avatar} alt="" />
                </div>
                <h1 className="text-[1rem] md:text-[1.1rem] pr-5 ">
                  {blog.createdBy && blog.createdBy.name}
                </h1>
                <div className="flex items-center gap-1 cursor-pointer">
                  <FaRegHeart />
                  <span>{Math.floor(Math.random() * 90) + 10}</span>
                </div>
              </div>
            </div>
            {blog.content.map((item, index) => {
              return (
                <div key={index}>
                  {ElementMap[`${item.type}`](item.data, item.id)}
                </div>
              );
            })}
          </div>
          {user && user._id && blog.createdBy.id === user._id && (
            <div className="hidden w-[25vw] md:flex flex-col gap-3 p-5 ">
              <button
                className="bg-white border-black border-[1px] md:border-[2px] border-solid min-w-[5rem] md:min-w-[10rem] rounded-full text-black text-sm md:text-lg font-bold px-4 p-[0.125rem]  md:p-2"
                onClick={() => {
                  setEdit(true);
                }}
              >
                Edit Blog
              </button>
              <button
                className="bg-red-600 min-w-[5rem] md:min-w-[10rem] text-sm md:text-lg  rounded-full text-white font-bold px-4 p-2"
                onClick={() => {
                  handleDeletePost(blogID);
                  setTimeout(() => {
                    navigate("/blog");
                    window.location.reload();
                  }, 1500);
                }}
              >
                Delete Blog
              </button>
            </div>
          )}
          <ToastContainer />
        </div>
      )}
      {!loading && !edit && (
        <div className="h-[20vh] w-[90vw]">
          <h1 className="text-left text-2xl p-3">Comments</h1>
          <form
            className="flex flex-col md:flex-row gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              value={comment}
              className="w-full md:w-[80%]  p-3 outline-none focus:outline-black rounded "
              onChange={(e) => {
                setComment(e.target.value);
              }}
              placeholder="Write a comment"
            />
            <button
              className="bg-black text-white p-2 min-w-[8rem] rounded text-3xl"
              onClick={() => {
                handleComment(comment);
                setComment("");
                console.log(user);
              }}
            >
              Post
            </button>
          </form>
          <div className="my-[3rem] mb-[10rem]">
            {blog?.comments?.map((comment, index) => {
              return (
                <div className="flex flex-col w-full min-h-[5rem]" key={index}>
                  <div className="flex w-full gap-3">
                    <img
                      className="w-[2rem] h-[2rem] rounded-full"
                      src={comment?.createdBy?.pfp}
                    />
                    <h1 className="font-bold mr-[1rem]">
                      {comment?.createdBy?.name}
                    </h1>
                    <h1 className="italic text-gray-700">
                      {comment?.createdAt}
                    </h1>
                  </div>
                  <h1>{comment?.text}</h1>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;
