'use client'
import React, { useState } from 'react';

const FullscreenSearch = ({openSearch, setOpenSearch} : any) => {
  const [searchData, setSearchData] = useState<string>("") 
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setOpenSearch(false)
    console.log(searchData) 
  };

  return (
    <>
      <div className={`search-wrap ${openSearch ? "d-block" : "d-none"}`}>
        <div className="search-inner">
          <i className="fas fa-times search-close" id="search-close" onClick={() => setOpenSearch(false)}></i>
          <div className="search-cell">
            <form method="get" onSubmit={handleSubmit}>
              <div className="search-field-holder">
                <input type="search" className="main-search-input" onChange={e => setSearchData(e.target.value)} placeholder="Search Your Keyword..." />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullscreenSearch;