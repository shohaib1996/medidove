'use client'
import Link from "next/link";
import Image from "next/image";
import NavMenu from "./Menu/NavMenu";
import HeaderLogo from "@/assets/img/logo/logo.png";
import PlagImg from "@/assets/img/icon/lang.png";
import SocialLinks from "@/components/common/SocialLinks";
import UseSticky from "@/hooks/UseSticky";
import { useState } from "react";
import MobileMenus from "./Menu/MobileMenus";

const header_content = {
	phone: "+1 800 833 9780",
	email: "info@example.com",
	btn_text: "Make Appointment",
}
const { phone, email, btn_text } = header_content

const HeaderOne = () => {
	const [isOpenMenu, setIsOpenMenu] = useState<boolean >(false)
	const { sticky } = UseSticky()
	return (
		<>
			<header>
				<div className="top-bar d-none d-md-block">
					<div className="container">
						<div className="row d-flex align-items-center">
							<div className="col-xl-6 offset-xl-1 col-lg-6 offset-lg-1 col-md-7 offset-md-1">
								<div className="header-info">
									<span><i className="fas fa-phone"></i>{phone}</span>
									<span><i className="fas fa-envelope"></i>{email}</span>
								</div>
							</div>
							<div className="col-xl-5 col-lg-5 col-md-4">
								<div className="header-top-right-btn f-right">
									<Link href="/appoinment" className="btn primary_btn">{btn_text}</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`header-menu-area ${sticky ? "sticky_menu" : ""}`}>
					<div className="container menu_wrapper">
						<div className="row align-items-center">
							<div className="col-xl-3 col-lg-3 col-md-6 col-6 d-flex align-items-center">
								<div className="logo logo-circle pos-rel">
									<Link href="/">
										<Image src={HeaderLogo} style={{height: 'auto'}} alt="theme-pure" />
									</Link>
								</div>
							</div>
							<div className="col-xl-9 col-lg-9 col-md-6 col-6">
								<div className="header-right f-right">
									<div className="header-social-icons f-right d-none d-xl-block">
										<ul>
											<li><SocialLinks /> </li>
										</ul>
									</div>

									<div className="header-lang f-right pos-rel d-none d-lg-block">
										<div className="lang-icon">
											<Image src={PlagImg} alt="theme-pure" />
											<span>EN<i className="fas fa-angle-down"></i></span>
										</div>
										<ul className="header-lang-list">
											<li><a href="#">USA</a></li>
											<li><a href="#">UK</a></li>
											<li><a href="#">CA</a></li>
											<li><a href="#">AU</a></li>
										</ul>
									</div>
								</div>
								<div className="header__menu f-right">
									<nav id="mobile-menu">
										<NavMenu />
									</nav>
								</div>
								<div className="side-menu-icon d-lg-none text-end">
									<button className="side-toggle border-0 bg-transparent" onClick={() => setIsOpenMenu(true)}>
										<i className="fas fa-bars"></i> </button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header> 
			{isOpenMenu && <MobileMenus isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />} 
		</>
	);
};

export default HeaderOne;