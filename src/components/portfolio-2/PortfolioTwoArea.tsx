'use client'
import Image from "next/image";
import React, {useState} from "react";
import portfolio_data from "@/data/PortfolioData";
import ImagePopup from '@/modals/ImagePopup';

// data
const categories = [
  "All",
  ...new Set(portfolio_data.map((item) => item.category)),
];
const perView = 6;

const PortfolioTwoArea = ({style}: any) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState(portfolio_data);
  const [next, setNext] = useState(perView);

  const filterItems = (cateItem: string) => {
    setActiveCategory(cateItem);
    setNext(perView);
    if (cateItem === "All") {
      return setItems(portfolio_data);
    } else {
      const findItems = portfolio_data.filter((findItem) => {
        return findItem.category == cateItem;
      });
      setItems(findItems);
    }
  };

  const nextItem = style ? 3 : 2;

  //   handleLoadMore
  const handleLoadMore = () => {
    setNext((value) => value + nextItem);
  };

  // photoIndex
  const [photoIndex, setPhotoIndex] = useState(null);
  // image open state
  const [isOpen, setIsOpen] = useState(false);
  // handleImagePopup
  const handleImagePopup = (i: any) => {
    setPhotoIndex(i);
    setIsOpen(true);
  };
  //  images
  const image = items.map((item) => item.img.src);

  return (
    <>
      <section className="portfolio-area pt-120 pb-90">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <div className="portfolio-filter mb-40">
                {categories.map((cate, i) => (
                    <React.Fragment key={i}>
                      <button
                        onClick={() => filterItems(cate)}
                        className={`${cate === activeCategory ? "active" : ""}`}
                      >
                        {cate}
                      </button>  {' '}
                    </React.Fragment>
                  ))} 
                </div>
              </div>
            </div>
          </div>
          <div id="portfolio-grid" className="row row-portfolio"> 
            {items.slice(0, next).map((item, i) =>
              <div key={i} className={`${style ? "col-lg-4" : "col-lg-6"} col-md-6 grid-item`}>
                <div className="portfolio-item mb-30">
                  <div className="portfolio-wrapper">
                    <div className="portfolio-image">
                      <Image src={item.img} style={{width: "100%", height: "auto"}} alt={item.title} />
                      <div className="view-icon">
                        <a className="popup-image" 
                        style={{ cursor: "pointer" }}
                        onClick={() => handleImagePopup(i)}
                        >
                          <i className="fas fa-plus"></i>
                        </a>
                      </div>
                    </div>
                    <div className="portfolio-caption">
                      <h4>{item.title}</h4>
                      <p>{item.tag}</p>
                    </div>
                  </div>
                </div>
              </div>            
            )} 
            {next < items.length && (
              <button onClick={handleLoadMore} className="load_more_btn btn btn-icon">
                Load More{' '}<span>+ </span>
              </button>
            )}
          </div>
        </div>
      </section>
      {/* image light box start */}
      {isOpen && (
        <ImagePopup
          images={image}
          setIsOpen={setIsOpen}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
        />
      )}
      {/* image light box end */}
    </>
  );
};

export default PortfolioTwoArea;
