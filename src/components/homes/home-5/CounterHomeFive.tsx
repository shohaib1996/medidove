'use client'
import React from 'react';
import Count from '@/components/common/Count';

type CounterItem = {
  id: number;
  icon: string;
  counter_number: number;
  title: string;
  sm_des: string;
};

const counter_data: CounterItem[] = [
  {
    id: 1,
    icon: "fal fa-clinic-medical",
    counter_number: 24,
    title: "AI Intake Channels",
    sm_des: "Web, WhatsApp, voice, and admin intake flows route patients into one Supabase-backed workspace.",
  },
  {
    id: 2,
    icon: "fal fa-user-nurse",
    counter_number: 12,
    title: "Receptionist Workflows",
    sm_des: "Voice summaries, handoff notes, and callback queues help staff respond faster without losing context.",
  },
  {
    id: 3,
    icon: "fal fa-trophy-alt",
    counter_number: 18,
    title: "Marketing Automations",
    sm_des: "Consent-based reminder, recall, and campaign tools keep patient outreach measurable and compliant.",
  },
  {
    id: 4,
    icon: "fal fa-ambulance",
    counter_number: 30,
    title: "Admin Insights",
    sm_des: "Dashboards surface bookings, conversations, call logs, and follow-up tasks for daily clinic operations.",
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
