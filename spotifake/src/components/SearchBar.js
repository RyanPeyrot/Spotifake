// SearchBar.js
import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center bg-spotify-grey p-4 rounded-full">
      <FaSearch className="text-gray-500 mr-3" />
      <input
        className="bg-transparent border-none text-white placeholder-gray-500 w-full focus:outline-none"
        type="text"
        placeholder="Que souhaitez-vous écouter ?"
        value={value}
        onChange={onChange} // Assurez-vous que cette fonction est appelée à chaque saisie
      />
    </div>
  );
}

export default SearchBar;
