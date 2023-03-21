import {
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Space, Table, notification, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import scss from "../project/style.module.scss";
import scss2 from "../project/styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUser } from "modules/List/slices/userSlices";
import { logout } from "modules/Authentication/slices/authSlice";
import {
  deleteUser,
  getAllUser,
  getdetailUser,
} from "modules/List/slices/userSlices";

import { Button, Modal, Drawer, Dropdown } from "antd";
import Highlighter from "react-highlight-words";
import useWindowSize from "hooks/useWindowsize";
const { Header, Sider, Content, Footer } = Layout;
const { confirm } = Modal;

const ListUser = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const { users, isLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const userz = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getAllUser());
  }, []);

  const showConfirm = (user) => {
    confirm({
      title: `Do you Want to delete user ${user.name} ?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setanimation(user.userId);
        setTimeout(() => {
          handleDelte(user.userId);
        }, 200);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
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
  const handleDelte = async (userIds) => {
    try {
      await dispatch(
        deleteUser({ userId: userIds, acc: userz.accessToken })
      ).unwrap();
      notification.success({
        message: "xoá user thành công",
      });
    } catch (error) {
      notification.error({
        message: "xoá user thất bại",
        description: error,
      });
    }
  };
  const [userz2, setuser] = useState(null);
  const handleSelect = (user) => {
    setuser(user);
    console.log(user);
    showDrawer();
    localStorage.setItem("userdetail", JSON.stringify(user));
  };
  //update
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
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
  const columns = [
    {
      title: "Id",
      dataIndex: "userId",
      key: "userId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, record) => (
        <img src={record.avatar} className={`${scss.img} border-0`} alt="" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render:(_,record)=>(
        <span style={{wordBreak:"break-word"}}>{record.email}</span>
      )
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleSelect(record);
            }}
            className="text-primary text-decoration-none me-3"
          >
            Edit
          </a>
          <a
            onClick={() => showConfirm(record)}
            className="text-primary text-decoration-none me-3"
          >
            Delete
          </a>
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

        return (
          <div className={scss.respontable}>
            <span>
              <h4>
                <span style={{ color: "gray" }}>ID:</span>
                <span>{record.userId}</span>
              </h4>
            </span>
            <hr />

            <span>
              <h4>
                <span style={{ color: "gray" }}>Name:</span>{" "}
                <span className={scss.textdecor}>
                  <span>{record.name}</span>
                </span>
              </h4>
            </span>
            <hr />

            <span>
              <h4>
                <span className="me-1" style={{ color: "gray" }}>
                  Email:
                </span>{" "}
                <span
                  style={{ wordBreak:"break-word"  }}
                >
                  {record.email}
                </span>
              </h4>
            </span>
            <hr />

            <span>
              <h4>
                <span style={{ color: "gray" }}>Action:</span>{" "}
                <Space size="middle">
                  <a
                    onClick={() => {
                      handleSelect(record);
                    }}
                    className={`${scss.textdecor} text-primary text-decoration-none me-3`}
                  >
                    Edit
                  </a>
                  <a
                    onClick={() => showConfirm(record)}
                    className={`${scss.textdecor} text-primary text-decoration-none me-3`}
                  >
                    Delete
                  </a>
                </Space>
              </h4>
            </span>
            <hr />
          </div>
        );
      },
    },
  ];
  const { width } = useWindowSize();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      id: "",
      email: "",
      name: "",
      phoneNumber: "",
    },
    mode: "onTouched",
  });
  function setInput() {
    setValue("id", userz2?.userId);
    setValue("name", userz2?.name);

    setValue("email", userz2?.email);
    setValue("phoneNumber", userz2?.phoneNumber);
  }
  const [animation, setanimation] = useState(null);
  const onSubmit = async (values) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const acce = user.accessToken;
    try {
      await dispatch(updateUser(values)).unwrap();
      // dispatch(getAllUser());
      setOpen(false);
      notification.success({
        message: "update user thành công",
      });
    } catch (error) {
      notification.error({
        message: "update user thất bại",
        description: error,
      });
    }
  };
  useEffect(() => {
    setSeacrh(users);
  }, [users]);
  const [searchani, setSeacrh] = useState(users);
  const handlesearch = (e) => {
    // if (e.key !== "Enter") return;
    let value = e.target.value.toUpperCase();
    console.log(value);
    const filterSearch = users.filter((user) => {
      const index = user.name.toUpperCase().indexOf(value);
      if (index !== -1) {
        return user;
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
      {userz2 ? (
        <Drawer
          title="Edit User"
          placement={"right"}
          width={500}
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
              <div>
                <div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={scss2.form}
                  >
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
                        })}
                      />

                      {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="name">
                        <h6>Name</h6>
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

                      {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone">
                        <h6>Phone Number</h6>
                      </label>
                      <input
                        id="phone"
                        type="text"
                        {...register("phoneNumber", {
                          required: {
                            value: true,
                            message: "không được để trống",
                          },
                        })}
                      />

                      {errors.phoneNumber && (
                        <p>{errors.phoneNumber.message}</p>
                      )}
                    </div>
                    {setInput()}
                    <button className="btn btn-success">Edit </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      ) : (
        <></>
      )}

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <h1 className="text-white text-center">JIRA</h1>
        <Menu
          // className="mt-5"
          theme="dark"
          mode="inline"
        />

        <div style={{ marginTop: "70px" }}>
          <div style={{ background: "#66cc99" }} className={scss.iho}>
            <UserOutlined />

            <span style={{ marginLeft: "6px" }}>User List</span>
          </div>
          <div
            className={scss.iho}
            onClick={() => {
              navigate("/CreateUser");
            }}
          >
            <VideoCameraOutlined />
            <span style={{ marginLeft: "6px" }}>Create User</span>
          </div>
          <div
            className={scss.iho}
            onClick={() => {
              navigate("/");
            }}
          >
            <UploadOutlined />

            <span style={{ marginLeft: "6px" }}>Project List</span>
          </div>
        </div>
      </Sider>
      <Layout>
        <div style={{ background: "white" }}>
          <div className="d-flex justify-content-between  align-items-center ps-3 pe-3">
            <div>
              <h1>User Management</h1>
            </div>
            <div>
              <span>
                {userz ? (
                  <Dropdown.Button
                    className="me-5"
                    menu={menuProps}
                    placement="bottom"
                    icon={<UserOutlined />}
                  >
                    {userz.name}
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
              record.userId === animation ? "styleanimation" : ""
            }
            columns={width > 720 ?columns : deviceColumns}
            dataSource={width > 720? [...users].reverse():[...searchani].reverse()}
          />
          ;
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

export default ListUser;
