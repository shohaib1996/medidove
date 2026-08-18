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
  email: string;
  password: string;
}
const schema = yup
  .object({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().min(6).label("Password"),

  })
  .required();


const LoginArea = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login successful.");
      reset();
      router.refresh();
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to log in.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    const emailInput = document.querySelector<HTMLInputElement>("#login-email");
    const email = emailInput?.value.trim();

    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password reset email sent.");
  };


  return (
    <>
      <section className="login-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="basic-login">
                <h3 className="text-center mb-60">Login From Here</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <label htmlFor="login-email">Email Address <span>**</span></label>
                  <input id="login-email" type="email" {...register("email")} placeholder="Enter email address..." />
                  <p className="form_error">{errors.email?.message}</p>

                  <label htmlFor="pass">Password <span>**</span></label>
                  <input id="pass" type="password" {...register("password")} placeholder="Enter password..." />
                  <p className="form_error">{errors.password?.message}</p>

                  <div className="login-action mb-20 fix">
                    <span className="log-rem f-left">
                      <input id="remember" type="checkbox" />
                      <label htmlFor="remember">Remember me!</label>
                    </span>
                    <span className="forgot-login f-right">
                      <button className="border-0 bg-transparent p-0" type="button" onClick={handlePasswordReset}>Lost your password?</button>
                    </span>
                  </div>
                  <button className="primary_btn btn-icon-green w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login Now"}
                  </button>
                  <div className="or-divide"><span>or</span></div>
                  <Link href="/register" className="primary_btn theme-btn-2 w-100">Register Now</Link>
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

export default LoginArea;
