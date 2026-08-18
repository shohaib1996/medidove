"use client";

import React, { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import NiceSelect from "@/ui/NiceSelect";

type SelectOption = {
  value: string;
  text: string;
};

type AppointmentForm = {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  requestedDepartment: string;
  requestedDoctor: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  consentAccepted: boolean;
};

const initialForm: AppointmentForm = {
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  requestedDepartment: "General Medicine",
  requestedDoctor: "First available doctor",
  requestedDate: "",
  requestedTime: "",
  reason: "",
  consentAccepted: false,
};

const departmentOptions: SelectOption[] = [
  { value: "General Medicine", text: "General Medicine" },
  { value: "Surgery and Radiology", text: "Surgery and Radiology" },
  { value: "Pediatrics", text: "Pediatrics" },
  { value: "Dental Care", text: "Dental Care" },
  { value: "Neurology", text: "Neurology" },
];

const doctorOptions: SelectOption[] = [
  { value: "First available doctor", text: "First available doctor" },
  { value: "Dentist", text: "Dentist" },
  { value: "Neurologist", text: "Neurologist" },
  { value: "Pediatrician", text: "Pediatrician" },
  { value: "Surgery consultant", text: "Surgery consultant" },
];

const AppoinmentCalculateArea = () => {
  const [form, setForm] = useState<AppointmentForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <Key extends keyof AppointmentForm>(
    key: Key,
    value: AppointmentForm[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const selectHandler = (item: SelectOption, name: string) => {
    if (name === "requestedDepartment") {
      updateField("requestedDepartment", item.value);
    }

    if (name === "requestedDoctor") {
      updateField("requestedDoctor", item.value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.patientName || !form.patientPhone || !form.reason) {
      toast.error("Name, phone, and appointment reason are required.");
      return;
    }

    if (!form.consentAccepted) {
      toast.error("Please accept the communication consent before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit appointment.");
      }

      toast.success("Appointment request submitted successfully.");
      setForm(initialForm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit appointment.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <NiceSelect
                          className="select_style"
                          options={departmentOptions}
                          defaultCurrent={0}
                          onChange={selectHandler}
                          name="requestedDepartment"
                          placeholder="Department"
                        />
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <NiceSelect
                          className="select_style"
                          options={doctorOptions}
                          defaultCurrent={0}
                          onChange={selectHandler}
                          name="requestedDoctor"
                          placeholder="Doctor"
                        />
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="calculate-form appointment-form-3 mb-20">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={form.patientName}
                            onChange={(event) =>
                              updateField("patientName", event.target.value)
                            }
                          />
                          <i className="far fa-user"></i>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="calculate-form appointment-form-3 mb-20">
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={form.patientEmail}
                            onChange={(event) =>
                              updateField("patientEmail", event.target.value)
                            }
                          />
                          <i className="far fa-envelope"></i>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="calculate-form appointment-form-3 mb-20">
                          <input
                            type="tel"
                            placeholder="Your Phone number"
                            value={form.patientPhone}
                            onChange={(event) =>
                              updateField("patientPhone", event.target.value)
                            }
                          />
                          <i className="fas fa-phone"></i>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="calculate-form appointment-form-3 mb-20">
                          <input
                            type="date"
                            value={form.requestedDate}
                            onChange={(event) =>
                              updateField("requestedDate", event.target.value)
                            }
                          />
                          <i className="far fa-calendar"></i>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="calculate-form appointment-form-3 mb-20">
                          <input
                            type="time"
                            value={form.requestedTime}
                            onChange={(event) =>
                              updateField("requestedTime", event.target.value)
                            }
                          />
                          <i className="far fa-clock"></i>
                        </div>
                      </div>

                      <div className="col-xl-12">
                        <div className="calculate-form appointment-form-3 mb-20">
                          <textarea
                            cols={30}
                            rows={10}
                            placeholder="Tell us the reason for your visit"
                            value={form.reason}
                            onChange={(event) =>
                              updateField("reason", event.target.value)
                            }
                          ></textarea>
                          <i className="far fa-edit"></i>
                        </div>
                      </div>

                      <div className="col-xl-12">
                        <label className="d-flex align-items-start gap-2 mb-25">
                          <input
                            type="checkbox"
                            checked={form.consentAccepted}
                            onChange={(event) =>
                              updateField(
                                "consentAccepted",
                                event.target.checked,
                              )
                            }
                          />
                          <span>
                            I agree to be contacted about this appointment by
                            phone, email, SMS, or WhatsApp.
                          </span>
                        </label>
                      </div>

                      <div className="col-xl-12">
                        <button
                          className="primary_btn btn mt-20"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "submitting..." : "submit query"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default AppoinmentCalculateArea;
