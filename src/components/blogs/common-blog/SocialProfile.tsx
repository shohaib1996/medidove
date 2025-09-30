
import SocialLinks from '@/components/common/SocialLinks';
import React from 'react';

const SocialProfile = () => {
  return (
    <>
      <div className="widget mb-40">
        <div className="widget-title-box mb-30">
          <span className="animate-border"></span>
          <h3 className="widget-title">Social Profile</h3>
        </div>
        <div className="social-profile">
          <SocialLinks />
        </div>
      </div>
    </>
  );
};

export default SocialProfile;