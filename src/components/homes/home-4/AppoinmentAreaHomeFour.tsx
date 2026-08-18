
import AppointmentSubmitHomeFour from '@/components/forms/AppoinmentSubmitHomeFour';  

const AppointmentAreaHomeFour = () => {
  return (
    <>
      <section className="appointment pos-rel">
        <div
          className="h4appointment-thumb" style={{ backgroundImage: `url(/assets/img/home4/appoinment/appoinment__thumb.jpg)` }}></div>
        <div className="container-fluid p-0 fix">
          <div className="col-xl-6 offset-xl-6">
            <div className="h4appointment-wrapper">
              <div className="about-title mb-50">
                <h5 className="pink-color">Make An Appointment</h5>
                <h1>
                  Get An Appointment <br />
                  For Get Release
                </h1>
              </div>
              <AppointmentSubmitHomeFour /> 
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppointmentAreaHomeFour;
