
import Link from 'next/link';
import React from 'react';

type DataType = string[]


const tags: DataType = [
  "Virtual Reception",
  "Online Booking",
  "Phone Support",
  "Care Follow-up",
  "Reminders",
  "Patient Intake",
  "Clinic CRM",
  "Automation",
  "Consent",
  "Healthcare SaaS",
  "RAG Search",
  "Admin Dashboard",
]
const InstagramTags = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">Topic Tags</h3>
        </div>
        <div className="tag">
          {tags.map((item) => <Link key={item} href="/blog">{item}</Link>)}
        </div>
      </div>
    </>
  );
};

export default InstagramTags;
