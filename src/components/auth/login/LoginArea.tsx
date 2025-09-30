'use client'
import Link from 'next/link';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';

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

  const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
  const onSubmit = (data: FormData) => {
    const notify = () => toast("Login Successful");
    notify()
    reset();
    console.log(data);
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
                  <label htmlFor="name">Email Address <span>**</span></label>
                  <input id="name" type="text" {...register("email")} placeholder="Enter Username or Email address..." />
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
                      <a href="#">Lost your password?</a>
                    </span>
                  </div>
                  <button className="primary_btn btn-icon-green w-100">Login Now</button>
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