'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import NavMenu from './Menu/NavMenu';
import UseSticky from '@/hooks/UseSticky';
import LogoTwo from '@/assets/img/logo/logo-2.png';
import Image from 'next/image';
import MobileMenus from './Menu/MobileMenus';

const HeaderTwo = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean >(false)
  const { sticky } = UseSticky()
  return (
    <>
      <header>
        <div className={`header-menu-area header-padding transparrent-header  ${sticky ? "sticky_menu sticky_navBar_bg" : ""}`}>
          <div className="container-fluid">
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6">
                <div className="logo pos-rel">
                  <Link href="/"><Image src={LogoTwo}  style={{height: 'auto'}} alt="theme-pure" /></Link>
                </div>
              </div>
              <div className="col-xl-6 col-lg-8 col-md-6 col-sm-6">
                <div className="header__menu header-menu-white">
                  <nav id="mobile-menu">
                    <NavMenu />
                  </nav>
                </div>
                <div className="side-menu-icon d-lg-none text-end">
                  <button className="side-toggle border-0 bg-transparent" onClick={() => setIsOpenMenu(true)}>
                    <i className="fas fa-bars text-white"></i> </button>
                </div>
              </div>
              <div className="col-xl-4 col-lg-2 d-none d-lg-block d-xl-block">
                <div className="header-right f-right">
                  <Link href="/contact" data-animation="fadeInLeft" data-delay=".6s" className="btn btn-icon btn-icon-green">
                    <span>+</span>contact us
                  </Link>
                  <Link href="#" data-animation="fadeInLeft" data-delay=".6s" className="btn btn-icon btn-icon-white">
                    <i className="fas fa-phone"></i>Make A Call
                  </Link>
                </div>
              </div>
              <div className="col-12">
                <div className="mobile-menu mobile-menu-white"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {isOpenMenu && <MobileMenus isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />}
    </>
  );
};

export default HeaderTwo;