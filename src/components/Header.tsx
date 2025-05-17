
import React from "react";
import { Images } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Images className="h-6 w-6 text-purple" />
          <h1 className="text-xl font-bold text-gray-800">Album Uploader</h1>
        </div>
        <div className="text-sm text-gray-500">Create beautiful digital albums</div>
      </div>
    </header>
  );
};

export default Header;
