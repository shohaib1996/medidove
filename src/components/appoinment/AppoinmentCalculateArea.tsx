"use client";
import React from "react";
import NiceSelect from "@/ui/NiceSelect";

const AppoinmentCalculateArea = () => {
  const selectHandler = (e: any) => {};
  return (
    <>
      <section
        className="appointment-area appointment-area-3 pos-rel pt-115 pb-120"
        style={{
          backgroundImage: `url(/assets/img/appoinment/appointment-bg.jpg)`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-8">
              <div className="calculate-box white-bg">
                <div className="calculate-content">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="about-title news-letter-title mb-70">
                        <h5 className="pink-color">Appointment</h5>
                        <h1>Book Appointment</h1>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <NiceSelect
                        className="select_style"
                        options={[
                          { value: "1", text: "Department" },
                          { value: "2", text: "Surgery and Radiology" },
                          { value: "3", text: "SPediatrics" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <NiceSelect
                        className="select_style"
                        options={[
                          { value: "1", text: "Doctor" },
                          { value: "2", text: "Doctor Name" },
                          { value: "3", text: "Doctor Name Two" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <NiceSelect
                        className="select_style"
                        options={[
                          { value: "1", text: "Your Name" },
                          { value: "2", text: "Name One" },
                          { value: "3", text: "Name Two" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <form
                        className="calculate-form appointment-form-3 mb-20"
                        action="#"
                      >
                        <input type="text" placeholder="Your Phone number" />
                        <i className="fas fa-phone"></i>
                      </form>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <form
                        className="calculate-form appointment-form-3 mb-20"
                        action="#"
                      >
                        <input type="text" placeholder="Select date" />
                        <i className="far fa-calendar"></i>
                      </form>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <form
                        className="calculate-form appointment-form-3 mb-20"
                         onSubmit={e => e.preventDefault()}
                      >
                        <input type="text" placeholder="Add time" />
                        <i className="far fa-clock"></i>
                      </form>
                    </div>
                    <div className="col-xl-12">
                      <form
                        className="calculate-form appointment-form-3 mb-20"
                        action="#"
                      >
                        <textarea
                          name="Special request"
                          cols={30}
                          rows={10}
                          placeholder="Special request"
                        ></textarea>
                        <i className="far fa-edit"></i>
                        <a href="#" className="primary_btn btn mt-40">
                          submit query
                        </a>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppoinmentCalculateArea;
