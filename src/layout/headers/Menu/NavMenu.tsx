import React, { useState } from "react";
import Link from "next/link";
import MenuData from "./MenuData";
import FullscreenSearch from "@/components/common/FullscreenSearch";

const NavMenu = ({home_4 } : any) => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  return (
    <>
      <ul>
        {MenuData.map((item, i) => (
          <li key={i}>
            <Link href={item.link}>{item.title}</Link>
            <ul className="submenu">
              {item.sub_menus?.map((sub_menu, index) =>
                <li key={index}>
                  <Link href={sub_menu.link}>{sub_menu.title}</Link>
                </li>
              )}
            </ul>
          </li>
        ))}
        {home_4 && <li><button style={{marginLeft: "10px"}} className="nav-search-icon">
          <i className="fal fa-search" onClick={() => setOpenSearch(true)}></i></button>
        </li>
        }
      </ul>
      {openSearch && <FullscreenSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />}
    </>
  );
};

export default NavMenu;

