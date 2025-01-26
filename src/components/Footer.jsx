import React, { useState, useEffect } from "react";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;

      setIsVisible(windowHeight + scrollTop >= documentHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 w-screen bg-black ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <div className="w-[90vw] h-[13vh] flex justify-center items-center">
        <h1 className="text-white text-md md:text-2xl">
          Designed and developed by{" "}
          <a
            href="https://github.com/nijiyamaharjan"
            target="_blank"
            className="hover:underline text-gray-400"
          >
            yours truly
          </a>
        </h1>
      </div>
    </div>
  );
}

export default Footer;
