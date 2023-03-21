import React, { useEffect } from "react";
import scss from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createProjectAuthorize,
  ProjectCategory,
} from "modules/List/slices/projectSlices";

const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: aliass } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(ProjectCategory());
    document.body.style.background =
      "linear-gradient(120deg, #2980b9, #8e44ad)";
    return () => {
      document.body.style.background = null;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      projectName: "",
      description: "",
      categoryId: "",
      alias: "",
    },
    mode: "onTouched",
  });

  const handleChange = (evt) => {
    const type = evt.target.value;
    setValue("categoryId", type);
  };

  const onSubmit = async (values) => {
    console.log(values);
    const user = JSON.parse(localStorage.getItem("user"));
    const acce = user.accessToken;
    try {
      await dispatch(createProjectAuthorize({ values, acce })).unwrap();
      navigate("/");
      notification.success({
        message: "tạo project thành công",
      });
    } catch (error) {
      notification.error({
        message: "tạo project thất bại",
        description: error,
      });
    }
  };
  return (
    <div className={scss.bg}>
      <div className={scss.title}>
        <div className="col-6 p-5 m-auto bg-white rounded-3">
          <h1 className="text-center">Create Project</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
            <div className="mb-3 ">
              <label htmlFor="name">
                <h6>Project Name</h6>
              </label>
              <input
                id="name"
                type="text"
                className={scss.cssform}
                {...register("projectName", {
                  required: true,
                })}
              />

              {errors.projectName?.type === "required" && (
                <p style={{ color: "red" }}>không được để trống</p>
              )}
              {errors.projectName?.type === "maxLength" && (
                <p style={{ color: "red" }}>không vượt quá 15 kí tự</p>
              )}
            </div>
            <div className="mb-3 ">
              <label htmlFor="texra">
                <h6>Decription</h6>
              </label>
              <textarea
                id="texra"
                className={scss.cssform}
                rows={8}
                placeholder="Description..."
                {...register("description", {
                  required: {
                    value: true,
                    message: "không được để trống",
                  },
                })}
              />
              {errors.description && (
                <p style={{ color: "red" }}>{errors.description.message}</p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="">
                <h6>Chọn dự án</h6>
              </label>
              <div className={scss.cssform}>
                <select
                 
                  {...register("categoryId", {
                    validate: (value) => value !== "",
                  })}
                >
                  <option value="">chọn dự án</option>
                  {aliass?.map((alia) => {
                    return (
                      <option key={alia.id} value={alia.id}>
                        {alia.projectCategoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
              {errors.categoryId?.type === "validate" && (
                <p style={{ color: "red" }}>vui lòng chọn lại</p>
              )}
            </div>
            <button className="btn btn-success">Create Project</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
