'use client'
import React, { useState } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const schema = yup.object({
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  phone: yup.string().required().label("Phone"),
  subject: yup.string().required().label("Subject"),
  message: yup.string().required().label("Message"),
}).required();



const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your message.");
      }

      toast.success("Message submitted successfully.");
      reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to submit your message.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-6">
            <div className="form-box user-icon mb-30">
              <input type="text" placeholder="Your Name" {...register("name")} />
              <p className="form_error">{errors.name?.message}</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-box email-icon mb-30">
              <input type="email" placeholder="Your Email" {...register("email")} />
              <p className="form_error">{errors.email?.message}</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-box phone-icon mb-30">
              <input type="text" placeholder="Your Phone" {...register("phone")} />
              <p className="form_error">{errors.phone?.message}</p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-box subject-icon mb-30">
              <input type="text" placeholder="Your Subject" {...register("subject")} />
              <p className="form_error">{errors.subject?.message}</p>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="form-box message-icon mb-30">
              <textarea {...register("message")} id="message" cols={30} rows={10} placeholder="Your Message"></textarea>
              <p className="form_error">{errors.message?.message}</p>
            </div>
            <div className="contact-btn text-center">
              <button className="btn btn-icon ml-0" type="submit" disabled={isSubmitting}>
                <span>+</span> {isSubmitting ? "submitting..." : "get action"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default ContactForm;
