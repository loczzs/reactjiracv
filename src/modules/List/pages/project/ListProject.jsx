import {
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, notification, Dropdown } from "antd";
import { Avatar, Button, Modal, Space, Table, Tag, Drawer, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import scss from "./style.module.scss";
import scss2 from "./styles.module.scss";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { set, useForm } from "react-hook-form";
import Highlighter from "react-highlight-words";
import {
  getAllProject,
  deleteProject,
  getUser,
  assignUserProject,
} from "modules/List/slices/projectSlices";
import { getProjectDetails } from "modules/List/slices/taskSlices";
import { removeUserz } from "modules/List/slices/projectSlices";
import { logout } from "modules/Authentication/slices/authSlice";
import { Tooltip } from "antd";
import useWindowSize from "hooks/useWindowsize";
import {
  getProjectDetail,
  updateProjects,
  ProjectCategory,
} from "modules/List/slices/projectSlices";
import "./style.css";
const { Header, Sider, Content, Footer } = Layout;

const { confirm } = Modal;

const ListProject = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const {
    data: projects,
    listuser: users,
    isLoading,
  } = useSelector((state) => state.project);

  const { data1: tasks } = useSelector((state) => state.task);

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const acce = user.accessToken;
  useEffect(() => {
    dispatch(getAllProject());
  }, []);
  useEffect(() => {
    setSeacrh(projects);
  }, [projects]);

  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      projectId: "",
      userId: "",
    },
  });
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const items = [
    {
      label: <span className="text-danger">Log out</span>,
      key: "1",
      icon: <LogoutOutlined />,
    },
  ];
  const menuProps = {
    items,
    onClick: handleLogout,
  };

  const showConfirm = (project, acces) => {
    confirm({
      title: `Do you Want to delete project ${project.projectName}  ?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setanimation(project.id);
        setTimeout(() => {
          handleDelete(project.id, acces);
        }, 200);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDelete = async (projectId, acces) => {
    try {
      await dispatch(deleteProject({ projectId, acces })).unwrap();

      notification.success({
        message: "xóa project thành công",
      });
    } catch (error) {
      notification.error({
        message: "xóa project thất bại",
        description: error,
      });
    }
  };

  const handleClick1 = () => {
    navigate("/");
  };

  const handleClick2 = () => {
    navigate("/addproject");
  };

  const handleClick3 = () => {
    navigate("/user");
  };

  const handleTask = (projectId) => {
    navigate(`/task/${projectId}`);
  };

  const handleChange = (evt) => {
    const type = evt.target.value;
    setValue("userId", type);
  };

  // update
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const { update: projectsup, list: aliass } = useSelector(
    (state) => state.project
  );

  const UpdateProject = async (projectId) => {
    setValue2("id", projectId);
    try {
      await dispatch(getProjectDetail({ projectId, acce })).unwrap();
      await dispatch(ProjectCategory()).unwrap();
      showDrawer();
    } catch {}
  };
  const {
    register,
    handleSubmit: handleSubmit2,
    formState: { errors },
    setValue: setValue2,
  } = useForm({
    defaultValues: {
      id: "",
      projectName: "",
      creator: "",
      description: "",
      categoryId: "",
    },
    mode: "onTouched",
  });

  const setInput = () => {
    setValue2("projectName", projectsup?.projectName);
    setValue2("description", projectsup?.description);
    setValue2("categoryId", projectsup?.projectCategory?.id);
    setValue2("creator", projectsup.creator?.id);
  };

  const onUpdate = async (values) => {
    console.log(values);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const acce = user.accessToken;
      await dispatch(
        updateProjects({ values, projectId: projectsup.id, acce })
      ).unwrap();
      onClose();

      notification.success({
        message: "update project thành công",
      });
    } catch (error) {
      notification.error({
        message: "update project thất bại",
        description: error,
      });
    }
  };
  const [searchani, setSeacrh] = useState(projects);

  //search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: "black",
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const [animation, setanimation] = useState(null);
  const { width } = useWindowSize();
  if (!user) {
    return <Navigate to="/login" />;
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Project ",
      dataIndex: "Project",
      key: "projectName",
      ...getColumnSearchProps("projectName"),
      render: (_, record) => (
        <div>
          {user.id === record.creator.id ||
          record.members.findIndex((mem) => mem.userId === user.id) !== -1 ? (
            <a
              onClick={() => handleTask(record.id)}
              className={`${scss.textdecor}  text-decoration-none me-3`}
            >
              {record.projectName}
            </a>
          ) : (
            <Tooltip color="red" title="you are not in the project">
              <a className={`${scss.textdecor}  text-decoration-none me-3`}>
                {" "}
                {record.projectName}
              </a>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (_, record) => {
        let color = "volcano";
        if (record.categoryId === 2) {
          color = "green";
        } else if (record.categoryId === 3) {
          color = "geekblue";
        }
        return (
          <div>
            <Tag color={color} key={record.id}>
              {record.categoryName}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      render: (_, record) => <span>{record.creator.name}</span>,
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",
      render: (_, record) => (
        <div>
          {record.members.length > 0 ? (
            <div className="row p-3">
              {record.members.slice(0, 2).map((mem) => {
                return (
                  <div style={{ width: "20px", padding: "0" }}>
                    <img
                      className={`${scss.img} `}
                      key={mem.userId}
                      src={mem.avatar}
                    ></img>
                  </div>
                );
              })}
              {record.members.length > 2 ? (
                <div className="col-sm-2 mb-1 pe-1 ps-1">
                  <Avatar
                    style={{
                      width: "35px",
                      height: "35px",
                      marginTop: "2px",
                      backgroundColor: "white",
                      verticalAlign: "middle",
                      color: "orangered",
                      border: "1px solid orangered",
                    }}
                    size="default"
                    // gap={gap}
                  >
                    {record.members.length - 2}+
                  </Avatar>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : user.id === record.creator.id ? (
            <a
              onClick={() => handleTask(record.id)}
              className={`${scss.textdecor}  text-decoration-none me-3`}
            >
              {" "}
              + add members
            </a>
          ) : (
            <Tooltip color="red" title="Not your project">
              <span>...</span>
            </Tooltip>
          )}
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {user.id === record.creator.id ? (
            <div>
              <a
                onClick={() => {
                  UpdateProject(record.id);
                  // showDrawer()
                }}
                className={`${scss.textdecor}  text-decoration-none me-3`}
              >
                edit
              </a>
              <a
                onClick={() => showConfirm(record, user.accessToken)}
                className={`${scss.textdecor}  text-decoration-none me-3`}
              >
                Delete
              </a>
            </div>
          ) : (
            <Tooltip color="red" title="Not your project">
              <span>...</span>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];
  const deviceColumns = [
    {
      render: (record, key, index) => {
        let color = "volcano";
        if (record.categoryId === 2) {
          color = "green";
        } else if (record.categoryId === 3) {
          color = "geekblue";
        }
        const id = record.id;

        return (
          <div className={scss.respontable}>
            <span>
              <h4>
                <span style={{ color: "gray" }}>ID:</span>
                <span>{id}</span>
              </h4>
            </span>
            <hr />

            <span>
              <h4>
                <span style={{ color: "gray" }}>Project:</span>{" "}
                <span className={scss.textdecor}>
                  {" "}
                  {user.id === record.creator.id ||
                  record.members.findIndex((mem) => mem.userId === user.id) !==
                    -1 ? (
                    <a
                      onClick={() => handleTask(record.id)}
                      className={`${scss.textdecor}  text-decoration-none me-3`}
                    >
                      <span style={{ wordBreak: "break-word", width: "250px" }}>
                        {record.projectName}
                      </span>
                    </a>
                  ) : (
                    <Tooltip color="red" title="you are not in the project">
                      <a
                        className={`${scss.textdecor}  text-decoration-none me-3`}
                      >
                        {" "}
                        {record.projectName}
                      </a>
                    </Tooltip>
                  )}
                </span>
              </h4>
            </span>
            <hr />

            <span>
              <h4>
                <span style={{ color: "gray" }}>Category:</span>{" "}
                <Tag className="mt-1" color={color} key={record.id}>
                  {record.categoryName}
                </Tag>
              </h4>
            </span>
            <hr />
            <span>
              <h4>
                <span style={{ color: "gray" }}>Creator:</span>{" "}
                {record.creator.name}
              </h4>
            </span>
            <hr />
            <span>
              <h4>
                <span
                  style={{
                    color: "gray",
                  }}
                >
                  Members:
                </span>

                {record.members.length > 0 ? (
                  <div className="d-flex">
                    {record.members.slice(0, 2).map((mem) => {
                      return (
                        <div>
                          <img
                            className={`${scss.img} `}
                            key={mem.userId}
                            src={mem.avatar}
                          ></img>
                        </div>
                      );
                    })}
                    {record.members.length > 2 ? (
                      <div className="col-sm-2 mb-1 pe-1 ps-1">
                        <Avatar
                          style={{
                            width: "35px",
                            height: "35px",
                            marginTop: "2px",
                            backgroundColor: "white",
                            verticalAlign: "middle",
                            color: "orangered",
                            border: "1px solid orangered",
                          }}
                          size="default"
                          // gap={gap}
                        >
                          {record.members.length - 2}+
                        </Avatar>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : user.id === record.creator.id ? (
                  <a
                    onClick={() => handleTask(record.id)}
                    className={`${scss.textdecor}  text-decoration-none me-3`}
                  >
                    {" "}
                    + add members
                  </a>
                ) : (
                  <Tooltip color="red" title="Not your project">
                    <span>...</span>
                  </Tooltip>
                )}
              </h4>
            </span>
            <hr />
            <span>
              <h4>
                <span style={{ color: "gray" }}>Action:</span>{" "}
                <Space size="middle">
                  {user.id === record.creator.id ? (
                    <div>
                      <a
                        onClick={() => {
                          UpdateProject(record.id);
                          // showDrawer()
                        }}
                        className={`${scss.textdecor} text-primary text-decoration-none me-3`}
                      >
                        edit
                      </a>
                      <a
                        onClick={() => showConfirm(record, user.accessToken)}
                        className={`${scss.textdecor} text-primary text-decoration-none me-3`}
                      >
                        Delete
                      </a>
                    </div>
                  ) : (
                    <Tooltip color="red" title="Not your project">
                      <span>...</span>
                    </Tooltip>
                  )}
                </Space>
              </h4>
            </span>
            <hr />
          </div>
        );
      },
    },
  ];

  const handlesearch = (e) => {
    // if (e.key !== "Enter") return;
    let value = e.target.value.toUpperCase();
    console.log(value);
    const filterSearch = projects.filter((pro) => {
      const index = pro.projectName.toUpperCase().indexOf(value);
      if (index !== -1) {
        return pro;
      } else {
        return;
      }
    });

    setSeacrh(filterSearch);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Drawer
        title="Update Project"
        placement={"right"}
        width={width > 720 ? 500 : "80%"} //100%
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <div>
          <div>
            <form
              key={2}
              onSubmit={handleSubmit2(onUpdate)}
              className={scss2.form}
            >
              <div className="mb-3">
                <label className="d-block mb-1" htmlFor="a1">
                  <h6>Name</h6>
                </label>
                <input
                  id="a1"
                  type="text"
                  {...register("projectName", {
                    required: {
                      value: true,
                      message: "không được để trống",
                    },
                  })}
                />

                {errors.projectName && (
                  <p style={{ color: "red" }}>{errors.projectName.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="mb-1" htmlFor="tex">
                  <h6> Description</h6>
                </label>
                <textarea
                  id="tex"
                  className="rounded-3 w-100 pe-3 p-1 ps-3"
                  style={{ width: "100%", height: "200px", resize: "none" }}
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
              <div className="mb-5">
                <label className="mb-1" htmlFor="select">
                  <h6>Chọn dự án</h6>
                </label>
                <select
                  className="rounded-3 w-100 pe-3 p-1 ps-3"
                  id="select"
                  style={{ display: "block" }}
                  {...register("categoryId", {})}
                >
                  {aliass?.map((alia) => {
                    return (
                      <option key={alia.id} value={alia.id}>
                        {alia.projectCategoryName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <button className="btn btn-success">Update Project</button>
            </form>
            {setInput()}
          </div>
        </div>
      </Drawer>

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <h1 className="text-white text-center pt-1">JIRA</h1>
        <Menu
          // className="mt-5"
          theme="dark"
          mode="inline"
        />

        <div style={{ marginTop: "70px" }}>
          <div
            style={{ background: "#66cc99" }}
            className={scss.iho}
            onClick={() => handleClick1()}
          >
            <UploadOutlined />

            <span style={{ marginLeft: "6px" }}>Projet List</span>
          </div>
          <div className={scss.iho} onClick={() => handleClick2()}>
            <VideoCameraOutlined />
            <span style={{ marginLeft: "6px" }}>Create Project</span>
          </div>
          <div className={scss.iho} onClick={handleClick3}>
            <UserOutlined />

            <span style={{ marginLeft: "6px" }}>User List</span>
          </div>
        </div>
      </Sider>
      <Layout>
        <div style={{ background: "white" }}>
          <div className="d-flex justify-content-between  align-items-center ps-3 pe-3">
            <div>
              <h1>Projects Management</h1>
            </div>
            <div>
              <span>
                {user ? (
                  <Dropdown.Button
                    className="me-5"
                    menu={menuProps}
                    placement="bottom"
                    icon={<UserOutlined />}
                  >
                    {user.name}
                  </Dropdown.Button>
                ) : null}
              </span>
            </div>
          </div>
        </div>

        <Content
          style={{
            margin: "24px 16px 0",
            background: "white",
          }}
        >
          {width > 720 ? (
            ""
          ) : (
            <div className={scss.searchcss}>
              <input
                id="search"
                style={{ width: "90%" }}
                placeholder="search projects"
                type="text"
                onChange={handlesearch}
              />
              <label className="mt-1" htmlFor="search">
                <SearchOutlined />
              </label>
            </div>
          )}
          <Table
            rowClassName={(record) =>
              record.id === animation ? "styleanimation" : ""
            }
            columns={width > 720 ? columns : deviceColumns}
            dataSource={
              width > 720 ? [...projects].reverse() : [...searchani].reverse()
            }
          />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ListProject;
