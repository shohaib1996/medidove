
import React from 'react';
import counter_icon_1 from "@/assets/img/counter/counter-icon-4.png";
import counter_icon_2 from "@/assets/img/counter/counter-icon-5.png";
import counter_icon_3 from "@/assets/img/counter/counter-icon-6.png";
import Image, { StaticImageData } from 'next/image';
import Count from '@/components/common/Count';


interface CounterDataType {
  id: number;
  icon: StaticImageData;
  count_number: number;
  title: string;
}[]

const counter_data: CounterDataType[] = [
  {
    id: 1,
    icon: counter_icon_1,
    count_number: 540,
    title: "Expert Doctors",
  },
  {
    id: 2,
    icon: counter_icon_2,
    count_number: 899,
    title: "Problem Solve",
  },
  {
    id: 3,
    icon: counter_icon_3,
    count_number: 100,
    title: "Award Winner",
  },
]
const CounterSectionHomeTwo = () => {
  return (
    <>
      <section className="counter-wraper theme-bg pt-120 pb-175">
        <div className="container">
          <div className="row justify-content-around">
            {counter_data.map((item, i) =>
              <div key={i} className="col-lg-2 col-md-3">
                <div className="single-couter counter-box text-center mb-180">
                  <Image src={item.icon} alt="theme-pure" />
                  <h1><span className="counter"> <Count number={item.count_number} add_style={true} /></span></h1>
                  <h6 className="green-color">{item.title}</h6>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CounterSectionHomeTwo;