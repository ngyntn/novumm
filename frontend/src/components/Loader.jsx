import React from "react";


function Loader( { isLoading }) {
    return isLoading && (
      <div className="fixed grid place-content-center inset-0 h-screen w-screen z-[20]">
        <div className="h-6 w-6 bg-transparent border-2 border-indigo-800 border-t-0 border-r-0 animate-spin rounded-full" />
      </div>
    );
}

export default Loader;
