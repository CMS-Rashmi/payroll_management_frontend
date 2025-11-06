import React from "react";

const StatCard = ({ title, amount, change, isPositive, sentence }) => {
  return (
    <div
      className="
        bg-white rounded-lg p-4 
        shadow-sm hover:shadow-lg 
        transition-all duration-200 
        hover:-translate-y-1 
        max-md:mb-4
      "
    >
      {/* Header */}
      <div className="text-[12px] font-medium mb-3 text-gray-700">
        {title}
      </div>

      {/* Number */}
      <div
        className="
          text-[25px] font-bold text-gray-900 mb-2 
          leading-none 
          font-sans 
          max-lg:text-[22px] 
          max-md:text-[20px]
        "
      >
        {amount}
      </div>

      {/* Change or Sentence */}
      <div
        className={`
          text-[14px] 
          ${isPositive === undefined ? "text-black" : isPositive ? "text-green-500" : "text-red-500"} 
          max-lg:text-[13px] 
          max-md:text-[12px]
        `}
      >
        {isPositive !== undefined ? (
          <>
            {isPositive ? "+" : "-"}
            {change}%
            {sentence && (
              <span className="text-black ml-1 text-[14px] max-lg:text-[13px] max-md:text-[12px]">
                {sentence}
              </span>
            )}
          </>
        ) : (
          sentence && (
            <span className="text-black ml-1 text-[14px] max-lg:text-[13px] max-md:text-[12px]">
              {sentence}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default StatCard;
