import bhittaOutline from "../assets/bhitta-outline.png";
import { fetchData, baseUrl } from "./apiCalls";
import { CiUser, CiLogout } from "react-icons/ci";
import { PiUserSwitchThin } from "react-icons/pi";
import { useGlobalContext } from "./Context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Nav() {
  const { user, setUser } = useGlobalContext();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const setData = async () => {
    let temp = await fetchData();
    if (temp) {
      setUser(temp);
    }
  };

  useEffect(() => {
    setData();
  }, []);
  const handleLogout = () => {
    // window.open("https://bhitta.onrender.com/logout", "_self");
    window.open(`${baseUrl}/logout`, "_self");
    
    // https://bhitta-sx20.onrender.com
    // window.open("http://localhost:6173/logout", "_self");
    localStorage.removeItem("info");
  };
  const handleLogin = async () => {
    const authWindow = window.open(
      // "https://bhitta.onrender.com/auth/google",
      `${baseUrl}/auth/google`,
      // "http://localhost:6173/auth/google",
      "_blank",
      "width=600, height=400"
    );
    window.addEventListener("message", (event) => {
      if (event.source === authWindow) {
        const jsonData = event.data;
        console.log("Received JSON data:", jsonData);
        localStorage.setItem("info", JSON.stringify(jsonData));
        authWindow.close();
        setData();
      }
    });
  };
  return (
    <>
      <div className="w-[100vw] bg-black relative">
        <div className="w-[90vw] mx-auto flex justify-start h-[16vh] items-center">
          <div
            className=" flex flex-1  md:flex-none w-[15vw] min-w-[9rem] h-[90%] cursor-pointer items-center justify-start"
            onClick={() => navigate("./")}
          >
            <img
              src={bhittaOutline}
              alt=""
              className="w-[100%]  h-[90%] min-h-[1vh] min-w-[13vw] object-contain" // Set a fixed width and height
            />
          </div>
          <div className="hidden md:flex flex-1">
            <h1 className="text-white text-3xl dancing-script pt-4">
              - Shout your thoughts
            </h1>
          </div>
          <div className="">
            <h1 className="text-white text-2xl">
              {!user.name ? (
                <button className="hover:underline" onClick={handleLogin}>
                  Sign In
                </button>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => setModal(!modal)}
                >
                  <CiUser size={40}></CiUser>
                </div>
              )}
            </h1>
          </div>
        </div>
      </div>
      {modal && (
        <div className="top-[5rem] flex flex-col right-[2rem] absolute w-[20rem] color-red-400 rounded-xl border-[2px] h-[12rem] p-4 bg-white border-solid border-black z-10">
          <div className="flex w-auto justify-around items-center gap-2 p-2 rounded-full border-[1px]  border-solid border-gray-600 full overflow-hidden">
            <img
              className="w-[2rem] rounded-full ml-auto"
              src={user.avatar}
            ></img>
            <h1 className="text-center mr-auto">{user.name}</h1>
          </div>
          <div className="flex flex-col mt-5">
            <h1 className="text-gray-500 text-center italic">{user.email}</h1>
            <button
              onClick={handleLogin}
              className="italic hover:underline transition-all mt-1"
            >
              <h1 className="flex items-center gap-1 justify-center">
                <PiUserSwitchThin /> Change Account
              </h1>
            </button>
            <button
              onClick={handleLogout}
              className="italic hover:underline transition-all mt-1"
            >
              <h1 className="flex items-center gap-1 justify-center">
                <CiLogout /> Log Out
              </h1>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
