import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllBlogs,
  fetchData,
  getTaggedBlogs,
} from "../components/apiCalls.js";

import { useGlobalContext } from "../components/Context";

const ListByTags = () => {
  const { user } = useGlobalContext();
  const [blogs, setBlogs] = useState([]);
  const [searchParams] = useSearchParams();
  const tags = searchParams.get("tags").split(" ");

  useEffect(() => {
    async function asyncWrapper() {
      let temp = await getTaggedBlogs(tags);
      setBlogs(temp.blogs);
      console.log(temp.blogs);
    }
    asyncWrapper();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="max-w-[95vw] md:max-w-[95vw]  mx-auto mt-3">
      <div className="min-h-[80vh]">
        {user && user.name && (
          <div className="w-[90vw] mx-auto flex md:flex-row flex-col justify-around items-center ">
            <h1 className="md:text-2xl text-xl">Here Are The Posts Tagged :</h1>
            <div>
              {tags?.map((el, index) => (
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
        )}

        <div className="min-h-[70vh] mb-[20vh]">
          {!blogs.length ? (
            <div className=" h-[60vh] flex justify-center w-[100vw] ">
              <img src="https://raw.githubusercontent.com/nijiyamaharjan/Bhitta/main/public/loading.gif" alt="" />
            </div>
          ) : (
            blogs.map((el) => {
              let firstImg;
              if (el.content)
                firstImg = el.content.find((m) => m.type === "image");
              if (el.content && firstImg)
                firstImg = firstImg.data
                  ? firstImg.data.file
                    ? firstImg.data.file.url
                      ? firstImg.data.file.url
                      : null
                    : null
                  : null;
              else firstImg = null;
              return (
                <div
                  key={el._id}
                  className="border-b-2 border-gray-300 w-[90vw] md:w-[60vw] md:min-w-[50rem] flex flex-col gap-2 m-1 p-4 pb-6 mx-auto cursor-pointer"
                  onClick={() => {
                    navigate("/blog/" + el._id);
                  }}
                >
                  <div className="flex flex-col w-full items-start font-bold">
                    <h1 className="text-black-600 text-[2rem] leading-10 ">
                      {el.title}
                    </h1>
                  </div>
                  <div className="flex gap-2 w-full items-start font-bold">
                    {el.tags?.map((tag, index) => (
                      <h1
                        className="text-black-600 text-md cursor-pointer hover:underline"
                        key={index}
                      >
                        {"#" + tag}
                      </h1>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row overflow-hidden justify-between object-cover">
                      <p className="w-[80%]">
                        {el.content &&
                          el.content.find((el) => el.type === "paragraph") &&
                          el.content
                            .find((el) => el.type === "paragraph")
                            .data.text.split("<br>")
                            .join("")}
                      </p>
                      <img
                        src={firstImg}
                        className="w-[80%] md:w-[100%] lg:w-[20%]"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex object-cover w-full justify-between rounded-full overflow-hidden mt-3">
                    <img
                      className="w-[1.5rem] mr-2 rounded-full"
                      src={el.createdBy.avatar}
                      alt=""
                    />
                    <h1 className="font-bold flex-1 text-gray-600 italic">
                      {el.createdBy.name}
                    </h1>
                    <h1 className="text-gray-700 italic">
                      {el.createdAt.split("T")[0]}
                    </h1>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default ListByTags;
