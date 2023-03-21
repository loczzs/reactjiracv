import React, { useEffect } from "react";
// import scss from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notification, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CreateUsers } from "modules/List/slices/userSlices";
import scss from "../project/styles.module.scss";

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, error: abc } = useSelector((state) => state.user);
  console.log(abc);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      passWord: "",
      name: "",
      phoneNumber: "",
    },
    mode: "onTouched",
  });
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(120deg, #2980b9, #8e44ad)";
    return () => {
      document.body.style.background = null;
    };
  }, []);

  const onSubmit = async (values) => {
    console.log(values);
    const user = JSON.parse(localStorage.getItem("user"));
    const acce = user.accessToken;
    try {
      await dispatch(CreateUsers(values)).unwrap();
      navigate("/user");
      notification.success({
        message: "tạo user thành công",
      });
    } catch (error) {
      notification.error({
        message: "tạo user thất bại",
        description: error,
      });
    }
  };
  return (
    <div className={scss.bg}>
      <div className={scss.title}>
        <div className="col-6 p-5 m-auto bg-white rounded-3">
          <h1 className="text-center">Create User</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
            <div>
              <label htmlFor="email">
                <h6>Email</h6>
              </label>
              <input
                id="email"
                type="text"
                {...register("email", {
                  required: {
                    value: true,
                    message: "không được để trống",
                  },
                  pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "email không đúng định dạng",
                },
                })}
              />

              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password">
                <h6> Pass Word</h6>
              </label>
              <input
                id="password"
                type="text"
                {...register("passWord", {
                  required: {
                    value: true,
                    message: "không được để trống",
                  },
                })}
              />

              {errors.passWord && (
                <p style={{ color: "red" }}>{errors.passWord.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name">
                <h6>User Name</h6>
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: {
                    value: true,
                    message: "không được để trống",
                  },
                })}
              />

              {errors.name && <p style={{color:"red"}}>{errors.name.message}</p>}
            </div>

            <div > 
            <label htmlFor="phone"><h6>Phone Numbers</h6></label>
              <input
              id="phone"
                type="number"
                
                className="quantity"
                style={{resize:"none"}}
                {...register("phoneNumber", {
                  required: {
                    value: true,
                    message: "không được để trống",
                  },
                  pattern: {
                  value:/^[0-9\b]+$/,
                  message: "phoneNumber không đúng định dạng",
                },
                })}
              />
             
              {errors.phoneNumber && <p style={{color:"red"}}>{errors.phoneNumber.message}</p>}
            </div>

            <button className="btn btn-success">Create user</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
