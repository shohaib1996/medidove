import React from 'react';

interface Datatype {
  table_head: string[];
  table_body: {
      id: number;
      title: string;
      body_data: {
          name: string;
          time: string;
      }[];
  }[];
}

const routine_content: Datatype = {
  table_head: [
    "Time Table",
    "08 : 00 am",
    "08 : 00 am",
    "08 : 00 am",
    "08 : 00 am",
    "08 : 00 am",
    "08 : 00 am",
  ],
  table_body: [
    {
      id: 1,
      title: "Monday",
      body_data: [
        { name: "Dr. Williuma", time: "08 am - 02 pm" },
        { name: "Dr. Dillon", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
      ],
    },
    {
      id: 2,
      title: "Tuesday",
      body_data: [
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
      ],
    },
    {
      id: 3,
      title: "Wednesday",
      body_data: [
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
      ],
    },
    {
      id: 4,
      title: "Thursday",
      body_data: [
        { name: "Dr. Asraf", time: "08 am - 02 pm" }, 
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "Dr. Salman", time: "08 am - 02 pm" },
        { name: "", time: "" },
      ],
    },
    {
      id: 5,
      title: "Friday",
      body_data: [
        { name: "", time: "" },
        { name: "Dr. Jamil", time: "08 am - 02 pm" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "", time: "" },
        { name: "Dr. Jamil", time: "08 am - 02 pm" },
      ],
    },
    {
      id: 2,
      title: "Saturday",
      body_data: [
        { name: "Dr. Abir Sabil", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "Dr. Mamun", time: "08 am - 02 pm" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
      ],
    },
    {
      id: 2,
      title: "Sunday",
      body_data: [
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
        { name: "Dr. Schroeder", time: "08 am - 02 pm" },
        { name: "", time: "" },
      ],
    },
  ]
}
const { table_head, table_body } = routine_content


const RoutineAreaHomeFive = () => {
  return (
    <>
      <div className="routine routine__bg pos-rel  pt-130 pb-115 fix" style={{ backgroundImage: `url(/assets/img/bg/routine__bg.jpg)` }}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="routine__table">
                <table className="table position-relative">
                  <thead>
                    <tr>
                      {table_head.map((head_item, head_i) =>
                        <th key={head_i} scope="col">
                          <span className="routine--time__heading">{head_item}</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {table_body.map((item, i) =>
                      <tr key={i}>
                        <th scope="row">{item.title}</th>
                        {item.body_data?.map((item, index) => 
                          <td key={index} className={`${item.name ? "active-doctor" : ""}`}>
                            <div className={`${item.name ? "doctor--routine__wrapper" : ""}`}>
                              <h2>{item.name}</h2>
                              <span>{item.time}</span>
                            </div>
                          </td>
                        )}
                      </tr>
                    )} 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoutineAreaHomeFive;