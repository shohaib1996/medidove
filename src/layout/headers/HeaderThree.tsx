'use client'
import Link from 'next/link';
import NavMenu from './Menu/NavMenu';
import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import SocialLinks from '@/components/common/SocialLinks';

import message_icon from "@/assets/img/cta/message-icon.png";
import phone_icon from "@/assets/img/cta/phone-icon.png";
import FullscreenSearch from '@/components/common/FullscreenSearch';
import header_logo from '@/assets/img/logo/logo-3.png';
import lang from '@/assets/img/icon/lang.png';
import UseSticky from '@/hooks/UseSticky';
import MobileMenus from './Menu/MobileMenus';


interface DataType {
  id: number;
  img: StaticImageData;
  title: string;
  info: string;
}[]

const header_contact_data: DataType[] = [
  {
    id: 1,
    img: message_icon,
    title: "Email Address",
    info: "infomail@medidove.com",
  },
  {
    id: 2,
    img: phone_icon,
    title: "Phone Number",
    info: "+87 (676) 6765 764",
  },
]

const header_content = {}
const { } = header_content

const HeaderThree = () => {
  const { sticky } = UseSticky()
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean >(false)

  return (
    <>
      <header>
        <div className={`top-bar-white top-bar-3 pt-30 pb-30 h3_topBar ${sticky ? "sticky_menu" : ""}`}>
          <div className="container">
            <div className="row d-flex align-items-center">
              <div className="col-xl-4 col-lg-4 col-md-6 col-6">
                <div className="logo logo-3 pos-rel">
                  <Link href="/"><Image src={header_logo} style={{height: 'auto'}} alt="theme-pure" /></Link>
                </div>
              </div>
              <div className="col-6 d-lg-none">
                <div className="side-menu-icon d-lg-none text-end">
                  <button className="side-toggle border-0 bg-transparent" onClick={() => setIsOpenMenu(true)}><i className="fas fa-bars"></i> </button>
                </div>
              </div>
              <div className="col-xl-8 col-lg-8 col-md-8 d-none d-lg-block">
                <div className="header-lang f-right pos-rel d-none d-lg-block p-0">
                  <div className="lang-icon">
                    <Image src={lang} alt="theme-pure" />
                    <span>EN<i className="fas fa-angle-down"></i></span>
                  </div>
                  <ul className="header-lang-list header-lang-list-3">
                    <li><a href="#">USA</a></li>
                    <li><a href="#">UK</a></li>
                    <li><a href="#">CA</a></li>
                    <li><a href="#">AU</a></li>
                  </ul>
                </div>
                {header_contact_data.map((item, i) =>
                  <div key={i} className="header-cta-info header-cta-info-3 d-flex f-left">
                    <div className="header-cta-icon">
                      <Image src={item.img} alt="theme-pure" />
                    </div>
                    <div className="header-cta-text">
                      <h5 className="theme-color">{item.title}</h5>
                      <span className="primary-color">{item.info}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`header-menu-area header-menu-blue theme-bg ${sticky ? "sticky_menu sticky_navBar_bg py-3" : ""}`}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8">
                <div className="header__menu menu-dark">
                  <nav id="mobile-menu">
                    <NavMenu />
                  </nav>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4">
                <div className="header-right f-right">
                  <div className="header-social-icons f-right d-none d-lg-block p-0">
                    <ul>
                      <li>
                        <SocialLinks />
                      </li>
                      <li className="header-menu-search">
                        <button className={`nav-search search-trigger ${openSearch ? "open" : ""}`}>
                          <i className="fas fa-search" onClick={() => setOpenSearch(true)}></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="mobile-menu mobile-menu-blue"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {openSearch && <FullscreenSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />}
      {isOpenMenu && <MobileMenus isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />}
    </>
  );
};

export default HeaderThree;