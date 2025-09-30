import HeaderOne from "@/layout/headers/HeaderOne";
import React from "react";
import Breadcrumb from "../common/breadcrumb/Breadcrumb";
import FooterThree from "@/layout/footers/FooterThree";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <>
      <HeaderOne />
      <main>
        <Breadcrumb sub_title="We are here for your care." title="404 || Error" page="404" />
        <div className="pt-120 pb-120">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 offset-xl-2">
                <div className="error-404 not-found mb-20">
                  <div className="error-404-content text-center">
                    <h1 className="error-404-title"> 404 </h1>
                    <h2 className="error-title">Page not found</h2>
                    <p className="err-text">
                      Oops! The page you are looking for does not exist. It
                      might have been moved or deleted.{" "}
                    </p>
                    <Link className="primary_btn" href="/">
                      <span>+</span>BACK TO HOME
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterThree />
    </>
  );
};

export default ErrorPage;
