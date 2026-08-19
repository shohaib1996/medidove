import { useState } from "react";
import Link from "next/link";
import MenuData from "./MenuData";
import FullscreenSearch from "@/components/common/FullscreenSearch";

type NavMenuProps = {
  home_4?: boolean;
};

const NavMenu = ({ home_4 }: NavMenuProps) => {
  const [openSearch, setOpenSearch] = useState(false);

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
        {home_4 && (
          <li>
            <button
              type="button"
              aria-label="Open site search"
              style={{ marginLeft: "10px" }}
              className="nav-search-icon"
              onClick={() => setOpenSearch(true)}
            >
              <i className="fal fa-search"></i>
            </button>
          </li>
        )}
      </ul>
      {openSearch && <FullscreenSearch openSearch={openSearch} setOpenSearch={setOpenSearch} />}
    </>
  );
};

export default NavMenu;

