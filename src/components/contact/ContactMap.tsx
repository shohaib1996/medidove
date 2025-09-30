
import React from 'react';

const ContactMap = () => {
  return (
    <>
      <section className="map-area">
        <div id="contact-map" className="contact-map">
          <div style={{ width: '100%', }}>
            <iframe
              title="Contact"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2242073.95673692!2d-101.47327132885862!3d39.09608451608003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54eab584e432360b%3A0x1c3bb99243deb742!2sUnited%20States!5e0!3m2!1sen!2sbd!4v1692245114248!5m2!1sen!2sbd"
              style={{ width: '100%' }}
              height={672}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactMap;