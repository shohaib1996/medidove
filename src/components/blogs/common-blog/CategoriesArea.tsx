import React from 'react';
interface DataType {
  id: number;
  title: string;
  items: number;
}[]

const categories_data: DataType[] = [
  { id: 1, title: 'Lifestyle', items: 78 },
  { id: 2, title: 'Travel', items: 42 },
  { id: 3, title: 'Fashion', items: 32 },
  { id: 4, title: 'Music', items: 85 },
  { id: 5, title: 'Branding', items: 221 },
]

const CategoriesArea = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">Categories</h3>
        </div>
        <ul className="cat">
          {categories_data.map((item, i) =>
            <li key={i}>
              <a href="#">{item.title} <span className="f-right">{item.items}</span></a>
            </li>
          )} 
        </ul>
      </div>
    </>
  );
};

export default CategoriesArea;