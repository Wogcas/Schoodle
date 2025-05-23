"use client"

import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import "../styles/SearchBar.css"

const SearchBar = ({ onSearchChange, placeholder = "Buscar por profesor o mensaje..." }) => {
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    onSearchChange(searchText)
  }, [searchText, onSearchChange])

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  )
}

SearchBar.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
}

export default SearchBar
