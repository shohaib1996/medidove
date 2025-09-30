'use client'
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';


interface FormData {
  name: string;
  email: string;
  phone: string;
  services: string; 
}

const schema = yup.object({
  name: yup.string().required().label("Name"),
  email: yup.string().required().email().label("Email"),
  phone: yup.string().required().label("Phone"),
  services: yup.string().required().label("Services"), 
}).required();

const AppoinmentSubmitHomeFour = () => {

  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  return (
    <>
      <form className="h4appoinment-form mb-15" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-lg-6 mb-20">
            <div className="h4appoinment-input pos-rel">
              <input type="text" placeholder="Enter Your Name" {...register("name")}  />
              <i className="h4input-icon"><i className="fal fa-user"></i></i>
            </div>
              <p className="form_error">{errors.name?.message}</p>
          </div>
          <div className="col-lg-6 mb-20">
            <div className="h4appoinment-input pos-rel">
              <input type="text" placeholder="Enter Your Email" {...register("email")} />
              <i className="h4input-icon">
                <i className="far fa-envelope-open"></i>
              </i>
            </div>
            <p className="form_error">{errors.email?.message}</p>
          </div>
          <div className="col-lg-6 mb-20">
            <div className="h4appoinment-input pos-rel">
              <input type="text" placeholder="Enter Your Phone" {...register("phone")} />
              <i className="h4input-icon"><i className="fal fa-phone"></i></i>
            </div>
            <p className="form_error">{errors.phone?.message}</p>
          </div>
          <div className="col-lg-6 mb-20">
            <div className="h4appoinment-input pos-rel">
              <input type="text" placeholder="Choose A Services" {...register("services")} />
              <i className="h4input-icon">
                <i className="fal fa-file-medical-alt"></i>
              </i>
            </div>
            <p className="form_error">{errors.services?.message}</p>
          </div>
        </div>
        <div className="h4appoinment-button mt-45">
          <button
            type='submit'
            data-animation="fadeInLeft"
            data-delay=".6s"
            className="btn btn-icon ml-0"
            style={{ animationDelay: "0.6s" }}
            tab-index="0"><span>+</span>Make Appointment</button>
        </div>
      </form>
    </>
  );
};

export default AppoinmentSubmitHomeFour;