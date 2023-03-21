import { Button, Form, Input, notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import scss from "./styles.module.scss";

const Login = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      email: "",
      passWord: "",
    },
    mode: "onTouched",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
      navigate("/");
      notification.success({
        message: "Đăng nhập thành công",
      });
    } catch (error) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: error,
      });
    }
  };

  const handleClick = () => {
    navigate("/register");
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
   <div className={scss.center}>
     <div className={scss.bg}>
      <div className={scss.contain2}>
        <h1 className="mb-3 ">Login</h1>
        <div>
          <Form
            onFinish={handleSubmit(onSubmit)}
          
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Email không được để trống",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  className={scss.item}
                  label="Email"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input type="text" {...field} className={scss.input} />
                </Form.Item>
              )}
            />

            <Controller
             
              name="passWord"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Mật khẩu không được để trống",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                style={{ marginBottom: "35px" }}
                  label="Mật khẩu"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input type="password" {...field} />
                </Form.Item>
              )}
            />

            <Form.Item   style={{ textAlign: "center", marginTop: "10px" }}
              wrapperCol={{ offset: 0 }}>
              <Button type="primary" htmlType="submit "  disabled={isLoading}
                loading={isLoading}
                className="me-3 ">
                Đăng Nhập
              </Button>
              <a href="" onClick={handleClick}>
                Đăng ký
              </a>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
   </div>
  );
};

export default Login;
