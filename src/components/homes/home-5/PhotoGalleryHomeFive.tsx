"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import photo_gallery_data from "@/data/PhotoGalleryData";
import back_icon from "@/assets/img/section/section-back-icon.png";
import title_line from "@/assets/img/shape/section-title-line.png";
import ImagePopup from "@/modals/ImagePopup";

// data
const categories = ["All", ...new Set(photo_gallery_data.map((item) => item.category))];
// const categories = ["All Collection", "Trending", "Beauty", "Cosmetics"];

const perView = 6;

const PhotoGalleryHomeFive = () => { 

  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState(photo_gallery_data);
  const [next, setNext] = useState(perView);

  const filterItems = (cateItem: string) => {
    setActiveCategory(cateItem);
    setNext(perView);
    if (cateItem === "All") {
      return setItems(photo_gallery_data);
    } else {
      const findItems = photo_gallery_data.filter((findItem) => {
        return findItem.category == cateItem;
      });
      setItems(findItems);
    }
  };

  //   handleLoadMore
  const handleLoadMore = () => {
    setNext((value) => value + 3);
  };

  // photoIndex
  const [photoIndex, setPhotoIndex] = useState(0);
  // image open state
  const [isOpen, setIsOpen] = useState(false);
  // handleImagePopup
  const handleImagePopup = (i: number) => {
    setPhotoIndex(i);
    setIsOpen(true);
  };
  //  images
  const image = items.map((item) => item.img.src); 


  return (
    <>
      <div className="photo-gallery pt-180 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">
              <div className="section-title text-center pos-rel mb-75">
                <div className="section-icon">
                  <Image className="section-back-icon" src={back_icon} alt="theme-pure" />
                </div>
                <div className="section-text pos-rel">
                  <h5>Workflow Gallery</h5>
                  <h1>Clinic journeys built for modern patient care</h1>
                </div>
                <div className="section-line pos-rel">
                  <Image src={title_line} alt="theme-pure" />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="gallery-button mb-50">
                <div className="gallery-filter">
                  {categories.map((cate) => (
                    <React.Fragment key={cate}>
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
          <div className="row gallery-portfolio">
            {items.slice(0, next).map((item, i) =>
              <div key={i} className="col-lg-4 col-md-6 grid-gallery">
                <div className="h5gallery__wrapper pos-rel text-center mb-30">
                  <div className="h5gallery-thumb">
                    <Image className="img" src={item.img} alt={item.title} />
                  </div>
                  <div className="h5gallery-content">
                    <a className="popup-image" 
                      style={{ cursor: "pointer" }}
                      onClick={() => handleImagePopup(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          handleImagePopup(i);
                        }
                      }}
                    >
                      <i className="fal fa-plus"></i>
                    </a>
                    <h4 className="white-color">
                      <Link href="/portfolio-details">{item.title}</Link>
                    </h4>
                    <span><Link href="/service">{item.tag_1}</Link> . <Link href="/service">{item.tag_2}</Link></span>
                  </div>
                </div>
              </div>
            )}
            {next < items.length && (
              <button onClick={handleLoadMore} className="btn btn-icon load_more_btn">
                <span>+</span>
                Load More
              </button>
            )}
          </div>
        </div>
      </div>

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

export default PhotoGalleryHomeFive;
