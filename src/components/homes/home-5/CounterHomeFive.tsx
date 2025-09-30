'use client'
import React from 'react';
import Count from '@/components/common/Count';

interface DataType {
  id: number;
  icon: string;
  counter_number: number;
  title: string;
  sm_des: string;
}[]

const counter_data: DataType[] = [
  {
    id: 1,
    icon: "fal fa-clinic-medical",
    counter_number: 3625,
    title: "World Wide Medical Branch",
    sm_des: "Avoids pleasure itself but who do not know how pursue pleasure rationally encounter cons",
  },
  {
    id: 2,
    icon: "fal fa-user-nurse",
    counter_number: 5236,
    title: "Trusted & Friendly Nurse",
    sm_des: "Avoids pleasure itself but who do not know how pursue pleasure rationally encounter cons",
  },
  {
    id: 3,
    icon: "fal fa-trophy-alt",
    counter_number: 8950,
    title: "We Wins Many Int Awards",
    sm_des: "Avoids pleasure itself but who do not know how pursue pleasure rationally encounter cons",
  },
  {
    id: 4,
    icon: "fal fa-ambulance",
    counter_number: 4562,
    title: "Emergency Ambulance",
    sm_des: "Avoids pleasure itself but who do not know how pursue pleasure rationally encounter cons",
  },
]

const CounterHomeFive = () => {
  return (
    <>
      <div className="fact h5fact-border pt-130 pb-90">
        <div className="container">
          <div className="row">
            {counter_data.map((item, i) =>
              <div key={i} className="col-lg-3 col-md-6">
                <div className="h5fact-wrapper mb-35">
                  <i className={item.icon}></i>
                  <span className="coutner"><Count number={item.counter_number}  /></span>
                  <h5>{item.title}</h5>
                  <p>{item.sm_des}</p>
                </div>
              </div>
            )} 
          </div>
        </div>
      </div>
    </>
  );
};

export default CounterHomeFive;