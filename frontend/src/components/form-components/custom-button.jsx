import React from "react";

const CustomButton = ({ valid, loading, text, handleClick }) => {
  return (
    <button
      onClick={handleClick}
      className={`${
        valid ? "bg-blue-900" : "bg-gray-400"
      } py-2 px-8 mt-4 font-bold text-white cursor-pointer transform transition-transform duration-200 active:scale-105 mx-auto block rounded-full flex items-center justify-center`}
      style={{ width: "100%" }}
      disabled={!valid}
    >
      {loading ? (
        <>
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default CustomButton;
