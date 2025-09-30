import { StaticImageData } from "next/image";

import product_img_1 from "@/assets/img/shop/img1.jpg";
import product_img_2 from "@/assets/img/shop/img2.jpg";
import product_img_3 from "@/assets/img/shop/img3.jpg";
import product_img_4 from "@/assets/img/shop/img4.jpg";
import product_img_5 from "@/assets/img/shop/img5.jpg";
import product_img_6 from "@/assets/img/shop/img6.jpg";
import product_img_7 from "@/assets/img/shop/img7.jpg";
import product_img_8 from "@/assets/img/shop/img8.jpg";
import product_img_9 from "@/assets/img/shop/img9.jpg";


interface DataType {
  id: number;
  img: StaticImageData;
  item_name: string;
  title: string;
  price: number;
  old_price: number;
  sm_des: string;
}[]


const shop_data: DataType[] = [
  {
    id: 1, 
    img: product_img_1,
    item_name: "Cloths",
    title: "Medidove Product",
    price: 95.00,
    old_price: 120.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 2, 
    img: product_img_2,
    item_name: "Cloths",
    title: "Legend Product",
    price: 90.00,
    old_price: 115.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 3, 
    img: product_img_3,
    item_name: "Cloths",
    title: "Akari Product",
    price: 100.00,
    old_price: 180.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 4, 
    img: product_img_4,
    item_name: "Cloths",
    title: "Bakari Product",
    price: 65.00,
    old_price: 110.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 5, 
    img: product_img_5,
    item_name: "Cloths",
    title: "Romada Product",
    price: 50.00,
    old_price: 80.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 6, 
    img: product_img_6,
    item_name: "Cloths",
    title: "Sikkar Product",
    price: 75.00,
    old_price: 90.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 7, 
    img: product_img_7,
    item_name: "Cloths",
    title: "Minners Product",
    price: 90.00,
    old_price: 110.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 8, 
    img: product_img_8,
    item_name: "Cloths",
    title: "Dolando Product",
    price: 200.00,
    old_price: 350.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 9, 
    img: product_img_9,
    item_name: "Cloths",
    title: "Romada Product",
    price: 250.00,
    old_price: 400.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  // for pagination 
  {
    id: 1, 
    img: product_img_6,
    item_name: "Cloths",
    title: "Sikkar Product",
    price: 75.00,
    old_price: 90.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 2, 
    img: product_img_7,
    item_name: "Cloths",
    title: "Minners Product",
    price: 90.00,
    old_price: 110.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 3, 
    img: product_img_8,
    item_name: "Cloths",
    title: "Dolando Product",
    price: 200.00,
    old_price: 350.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 4, 
    img: product_img_9,
    item_name: "Cloths",
    title: "Romada Product",
    price: 250.00,
    old_price: 400.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 5, 
    img: product_img_1,
    item_name: "Cloths",
    title: "Medidove Product",
    price: 95.00,
    old_price: 120.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 6, 
    img: product_img_2,
    item_name: "Cloths",
    title: "Legend Product",
    price: 90.00,
    old_price: 115.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 7, 
    img: product_img_3,
    item_name: "Cloths",
    title: "Akari Product",
    price: 100.00,
    old_price: 180.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 8, 
    img: product_img_4,
    item_name: "Cloths",
    title: "Bakari Product",
    price: 65.00,
    old_price: 110.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 9, 
    img: product_img_5,
    item_name: "Cloths",
    title: "Romada Product",
    price: 50.00,
    old_price: 80.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  
  // for pagination 
  {
    id: 1, 
    img: product_img_1,
    item_name: "Cloths",
    title: "Medidove Product",
    price: 95.00,
    old_price: 120.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 2, 
    img: product_img_2,
    item_name: "Cloths",
    title: "Legend Product",
    price: 90.00,
    old_price: 115.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 3, 
    img: product_img_3,
    item_name: "Cloths",
    title: "Akari Product",
    price: 100.00,
    old_price: 180.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 4, 
    img: product_img_4,
    item_name: "Cloths",
    title: "Bakari Product",
    price: 65.00,
    old_price: 110.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
  {
    id: 5, 
    img: product_img_5,
    item_name: "Cloths",
    title: "Romada Product",
    price: 50.00,
    old_price: 80.00,
    sm_des: "exercitation ullamco laboris nisi ut aliquip lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna  aliqua. Ut enim ad minim veniam, quis nostrud ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
  },
   
]
export default shop_data