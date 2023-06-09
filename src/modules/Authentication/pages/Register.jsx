import authAPI from "apis/authAPI";
import useRequest from "hooks/useRequest";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { registers } from "../slices/authSlice";
import scss from "./styles.module.scss";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      passWord: "",
      name: "",
      phoneNumber: "",
    },
    mode: "onTouched",
  });
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      await dispatch(registers(values)).unwrap();
      navigate("/login");
      notification.success({
        message: "Đăng ký thành công",
      });
    } catch (error) {
      notification.error({
        message: "Đăng ký thất bại",
        description: error,
      });
    }
  };

  const onError = (error) => {
    console.log(error);
  };

  return (
    <div className={scss.center}>
      <div  className={scss.bg}>
        <div className={scss.contain} >
          <h1 className="mb-3 text-center">Đăng ký</h1>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className={scss.form}
          >
            <div className={scss.inputbox}>
              <input
               required="required"
                type="text"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email không được để trống",
                  },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Email không đúng định dạng",
                  },
                })}
              />
              <span>Email</span>
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
              )}
            </div>
            <div className={scss.inputbox}>
              <input
               required="required"
                type="password"
                {...register("passWord", {
                  required: {
                    value: true,
                    message: "mật khẩu không được để trống",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message: "ít nhất 8 ký tự, gồm chữ cái và số",
                  },
                })}
              />
              <span>Password</span>
              {errors.passWord && (
                <p style={{ color: "red" }}>{errors.passWord.message}</p>
              )}
            </div>

            <div  className={scss.inputbox} >
              <input
               required="required"
                type="text"
                {...register("name", {
                  required: {
                    value: true,
                    message: "họ tên không được để trống",
                  },
                })}
              />
              <span>Fullname</span>
              {errors.name && (
                <p style={{ color: "red" }}>{errors.name.message}</p>
              )}
            </div>

            <div  className={scss.inputbox} >
              <input
               required="required"
                type="text"
                {...register("phoneNumber", {
                  required: {
                    value: true,
                    message: "số điện thoại không được để trống",
                  },
                })}
              />
              <span>PhoneNumber</span>
              {errors.phoneNumber && (
                <p style={{ color: "red" }}>{errors.phoneNumber.message}</p>
              )}
            </div>

            <button>Đăng Ký</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
