import Link from "next/link";
import type { ReactNode } from "react";

interface SocialLinksDataType {
  link: string;
  icon: string;
}


const social_links: SocialLinksDataType[] = [
  {
    link: "https://facebook.com",
    icon: "fab fa-facebook-f",
  },
  {
    link: "https://behance.com",
    icon: "fab fa-behance",
  },
  {
    link: "https://www.youtube.com",
    icon: "fab fa-youtube",
  },
  {
    link: "https://www.linkedin.com",
    icon: "fab fa-linkedin",
  },
  {
    link: "https://www.pinterest.com",
    icon: "fab fa-pinterest",
  },
];

const SocialLinks = () => {
  return (
    <>
      {social_links.map((l, i) => (
        <Link
          key={i}
          href={l.link}
          target="_blank"
          rel="noreferrer">
          <i className={l.icon} ></i> {' '}
        </Link>
      ))}
    </>
  );
};

export default SocialLinks;




interface SocialLinksTwoDataType {
  link: string;
  color: string;
  icon: string;
}


const social_links_2: SocialLinksTwoDataType[] = [
  {
    link: "https://facebook.com",
    color: "footer-facebook",
    icon: "fa-brands fa-facebook-f",
  },
  {
    link: "https://twitter.com",
    color: "",
    icon: "fa-brands fa-twitter",
  },
  {
    link: "https://www.linkedin.com",
    color: "footer-linkedin",
    icon: "fa-brands fa-linkedin-in",
  },
  {
    link: "https://www.instagram.com",
    color: "footer-insta",
    icon: "fa-brands fa-instagram",
  },
];

export const SocialLinksTwo = () => {
  return (
    <>
      {social_links_2.map((link, index) => (
        <Link
          key={index}
          href={link.link}
          className={link.color}
          target="_blank"
          rel="noreferrer">
          <i className={link.icon}></i>{" "}
        </Link>
      ))}
    </>
  );
};




// team social links
interface TeamSocialLinksDataType {
  id: number;
  link: string;
  icon: string;
}
const team_social_data: TeamSocialLinksDataType[] = [
  {
    id: 1,
    link: "https://facebook.com",
    icon: "fab fa-facebook-f",
  },
  {
    id: 2,
    link: "https://twitter.com",
    icon: "fab fa-twitter",
  },
  {
    id: 3,
    link: "https://behance.com",
    icon: "fab fa-behance",
  },
  {
    id: 4,
    link: "https://pinterest.com",
    icon: "fab fa-pinterest",
  },
  {
    id: 5,
    link: "https://linkedin.com",
    icon: "fab fa-linkedin",
  },
]

export const TeamSocialLinks = () => {
  return (
    <>
      {team_social_data.map((t_item, t_index) => (
        <li key={t_index}>
          <Link 
            href={t_item.link}
            target="_blank"
            rel="noreferrer">
            <i className={t_item.icon}></i>{" "}
          </Link>
        </li>
      ))}
    </>
  )
}


// copy right text 
type CopyRightDataType = {
  copy_right: ReactNode;
}

const copy_right_text: CopyRightDataType = {
  copy_right: <> ©{new Date().getFullYear()} MediDove Clinic Platform. All rights reserved.
  </>,
}

const { copy_right } = copy_right_text
export const CopyRight = () => {
  return (
    <> {copy_right}</>
  )
}


