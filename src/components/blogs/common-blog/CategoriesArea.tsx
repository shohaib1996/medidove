import React from 'react';
import Link from 'next/link';

type CategoryItem = {
  id: number;
  title: string;
  items: number;
};

const categories_data: CategoryItem[] = [
  { id: 1, title: 'AI Receptionist', items: 18 },
  { id: 2, title: 'Smart Intake', items: 14 },
  { id: 3, title: 'Patient Outreach', items: 21 },
  { id: 4, title: 'Clinic Admin', items: 16 },
  { id: 5, title: 'Compliance', items: 9 },
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
              <Link href="/blog">{item.title} <span className="f-right">{item.items}</span></Link>
            </li>
          )} 
        </ul>
      </div>
    </>
  );
};

export default CategoriesArea;
