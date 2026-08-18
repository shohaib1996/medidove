'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';


import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { createClient } from '@/lib/supabase/client';


interface FormData {
  name: string;
  email: string;
  password: string;
}
const schema = yup
  .object({
    name: yup.string().required().label("Name"),
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().min(6).label("Password"), 

  })
  .required();


const RegisterArea = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Account created. Check your email if confirmation is enabled.");
      reset();
      router.refresh();
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <section className="login-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="basic-login">
                <h3 className="text-center mb-60">Signup From Here</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <label htmlFor="register-name">Full Name <span>**</span></label>
                  <input id="register-name" type="text" {...register("name")} placeholder="Enter your full name..." />
                  <p className="form_error">{errors.name?.message}</p>

                  <label htmlFor="email-id">Email Address <span>**</span></label>
                  <input id="email-id" type="email" {...register("email")} placeholder="Enter email address..." />
                  <p className="form_error">{errors.email?.message}</p>

                  <label htmlFor="pass">Password <span>**</span></label>
                  <input id="pass" type="password" {...register("password")} placeholder="Enter password..." />
                  <p className="form_error">{errors.password?.message}</p>

                  <div className="mt-10"></div>
                  <button className="primary_btn theme-btn-2 w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Register Now"}
                  </button>
                  <div className="or-divide"><span>or</span></div>
                  <Link href="/login" className="primary_btn btn-icon-green w-100">login Now</Link>
                  <ToastContainer />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterArea;
