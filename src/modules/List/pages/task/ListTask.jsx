import {
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DeleteOutlined,
  PlusOutlined,
  ProfileOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Tooltip } from "antd";
import { Button, Modal, Input } from "antd";
import React, { useState, useEffect, useRef } from "react";
import scss from "./style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { notification, Avatar, Space, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectDetails,
  getAllComment,
  insertComment,
  deleteComment,
  updateComment,
} from "modules/List/slices/taskSlices";
import { removeTaskz } from "modules/List/slices/taskSlices";
import { updateTasks } from "modules/List/slices/taskSlices";
import { render } from "@testing-library/react";
import { Alert } from "bootstrap";
import { getUser } from "modules/List/slices/projectSlices";
import Highlighter from "react-highlight-words";
import useWindowSize from "hooks/useWindowsize";
import {
  assignUserProject,
  removeUserz,
} from "modules/List/slices/projectSlices";
const { Header, Sider, Content, Footer } = Layout;
const { confirm } = Modal;

const ListProject = () => {
  const [open, setOpen, collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [openmodal, setOpenmodal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { listuser } = useSelector((state) => state.project);
  const user = JSON.parse(localStorage.getItem("user"));
  const acces = user.accessToken;
  const [rederbut, setRenderbut] = useState(false);
  const { taskId } = useParams();
  localStorage.setItem("projecidjira", JSON.stringify(taskId));
  const { data1: tasks, comment } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(getProjectDetails({ taskId, acces }));
    dispatch(getUser(acces));
  }, []);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      id: "",
      taskId: "",
      contentComment: "",
    },
  });

  const showModalb = (a) => {
    dispatch(getAllComment(a));
    setValue("taskId", a);
    setOpen(true);
    setpalhoder();
  };
  function setpalhoder() {
    setValue("contentComment", "");
    document.getElementById("comment").value = "";
    document.getElementById("comment").placeholder = "viết bình luận";
  }

  const handleOkb = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancelb = () => {
    setRenderbut(false);
    setOpen(false);
    setValue("contentComment", " ");
    setValue("id", "");
  };

  const UpdateTask = (taskId) => {
    navigate(`/task/updatetask/${taskId}`);
  };

  const showConfirm = (taskIds, acce, taskId, name) => {
    confirm({
      title: `Do you Want to delete task ${name}  ?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDelete(taskIds, acce, taskId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDelete = (taskIds, acce, taskId) => {
    dispatch(removeTaskz({ taskIds, acce, taskId }));
  };

  const handleClick1 = (taskId) => {
    navigate(`/task/${taskId}/addtask`);
  };

  const handleDeleteComment = async (commentId, acces, taskId) => {
    await dispatch(deleteComment({ commentId, acces, taskId })).unwrap();
    setValue("contentComment", "");
    document.getElementById("comment").value = "";
    document.getElementById("comment").placeholder = "viết bình luận";
    setRenderbut(false);
  };

  const onSubmit = async (values) => {
    console.log(values);
    const user = JSON.parse(localStorage.getItem("user"));
    const acces = user.accessToken;
    if (values.contentComment === "") {
      return;
    }
    try {
      if (values.id === "") {
        dispatch(insertComment({ values, acces }));
        setValue("contentComment", "");
        document.getElementById("comment").value = "";
        document.getElementById("comment").placeholder = "viết bình luận";
        notification.success({
          message: "thêm comment thành công",
        });
      } else {
        dispatch(updateComment({ values, acces }));
        notification.success({
          message: "update comment thành công",
        });
      }
    } catch (error) {
      notification.error({
        message: "thêm comment thất bại",
        description: error,
      });
    }
  };
  const handleGetdetail = (comment) => {
    setRenderbut(comment.id);
    setValue("contentComment", comment.contentComment);
    setValue("id", comment.id);
  };

  const handleClick2 = () => {
    navigate("/");
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
          fontSize: "15px",
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
  const { width } = useWindowSize();
  const modal = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId1",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar1",
      hidden: width < 720 ? true : false,

      render: (_, record) => (
        <img className={scss.img} src={record.avatar} alt="" />
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name1",
      ...getColumnSearchProps("name"),
      render:(_,record)=>(
        <span style={{wordBreak:"break-word"}}>{record.name}</span>
      )
    },
    {
      key: "action1",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() =>
              onaddMember({ projectId: tasks.id, userId: record.userId })
            }
            className="btn btn-primary"
          >
            Add
          </button>
        </Space>
      ),
    },
  ].filter((item) => !item.hidden);;
  const modal2 = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      hidden: width < 720 ? true : false,
      render: (_, record) => (
        <img className={scss.img} src={record.avatar} alt="" />
      ),
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render:(_,record)=>(
        <span style={{wordBreak:"break-word"}}>{record.name}</span>
      )
    },
    {
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => removeUser(record.userId)}
            className="btn btn-danger"
          >
            Remove
          </button>
        </Space>
      ),
    },
  ].filter((item) => !item.hidden);

  const removeUser = async (userId) => {
    try {
      dispatch(removeUserz({ values: { projectId: tasks.id, userId }, acces }));
      notification.success({
        message: "xóa user thành công",
      });
    } catch (error) {
      notification.error({
        message: "xóa user thất bại",
        description: error,
      });
    }
  };
  const onaddMember = async (values) => {
    console.log(values);
    try {
      await dispatch(assignUserProject({ values, acces })).unwrap();
      notification.success({
        message: "thêm user thành công",
      });
    } catch (error) {
      notification.error({
        message: "thêm user thất bại",
        description: error,
      });
    }
  };
  return (
    <Layout style={{ height: "100vh", background: "" }}>
      <Modal
        title={`Add members to project ${tasks.projectName}`}
        centered={false}
        open={openmodal}
        onOk={() => setOpenmodal(false)}
        onCancel={() => setOpenmodal(false)}
        width={1000}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className="row">
          <div className="col-sm-6">
           <div className="d-flex">
           <h4 style={{borderBottom:"1px solid #0d6efd", marginRight:"30px"}}>Not yet added</h4>
            <h4><a  href="#table2">Already in project</a></h4>
           </div>
            <div className="pe-3" style={{ borderRight: width < 576 ? "0px" : "1px solid #dddd" }}>
              <Table
              
                columns={modal}
                dataSource={listuser?.filter((mem) => {
                  let index = tasks?.members?.findIndex(
                    (us) => us.userId === mem.userId
                  );
                  if (index !== -1) {
                    return false;
                  }
                  return true;
                })}
                
              />
              
            </div>
          </div>
          <div id="table2" className="col-sm-6">
            <h4>Already in project</h4>
            <Table id="table2" columns={modal2} dataSource={tasks.members} />
          </div>
        </div>
      </Modal>

      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
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
            className={scss.iho}
            onClick={() => {
              navigate("/");
            }}
          >
            <UploadOutlined />

            <span>Projet List</span>
          </div>
          <div className={scss.iho} onClick={() => handleClick1(taskId)}>
            <VideoCameraOutlined />
            <span>Create Task</span>
          </div>
          <div
            onClick={() => {
              navigate("/user");
            }}
            className={scss.iho}
          >
            <UserOutlined />

            <span>User List</span>
          </div>
        </div>
      </Sider>

      <Layout className="site-layout bg-white p-3">
        <div className="container bg-white mb-3 ">
          <p>
            <span
              onClick={() => {
                navigate("/");
              }}
              className={scss.linkpro}
            >
              Projects
            </span>{" "}
            / <b>{tasks.projectName}</b>
          </p>
          <div className="d-flex flex-wrap  align-items-center">
            <span style={{ marginRight: "6px" }}>Members:</span>
            <div className="d-flex flex-wrap  align-items-center ">
              {tasks?.members?.map((mem) => {
                return (
                  <div className="me-1">
                    <img className={scss.img3} src={mem.avatar} alt="" />
                  </div>
                );
              })}
              <div style={{ width: "20px", padding: "0" }}>
                <button
                  className={scss.buttons2}
                  onClick={() => {
                    setOpenmodal(true);

                    // handleClick4(record.id, user.accessToken);
                    // handleClick5(user.accessToken);
                  }}
                >
                  <PlusOutlined style={{ color: "#0d6efd" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Content style={{ backgroundColor: "white" }}>
          <div className="container pb-3">
            <div className={`${scss.status} row`}>
              {tasks?.lstTask?.map((status) => {
                const sta = status.lstTaskDeTail
                  .map((lst) => {
                    return { ...lst, priorityId: lst.priorityTask.priorityId };
                  })
                  .sort((a, b) => a.priorityId - b.priorityId);
                return (
                  <div
                    key={status.statusId}
                    className={`${scss.statusRow} col-3`}
                  >
                    <div
                      style={{ background: "#f3f4f6" }}
                      className=" p-3   rounded-3  "
                    >
                      <p className="ms-1">{status.statusName}</p>

                      <div>
                        {sta
                          .map((lstTask) => {
                            {
                              /* console.log(lstTask) */
                            }
                            let protyId = lstTask.priorityTask.priorityId;
                            let proty = lstTask.priorityTask.priority;

                            return (
                              <Tooltip
                                placement="bottom"
                                title={`Description: ${lstTask.description}`}
                              >
                                <div
                                  style={{
                                    borderRadius: "10px",
                                  }}
                                  className="bg-white mb-3 p-1"
                                >
                                  <div
                                    className="col-sm-12   "
                                    key={lstTask.taskId}
                                    style={{ margin: "10px 0" }}
                                  >
                                    <div width={"100%"}>
                                      <span> {lstTask.taskName}</span>
                                    </div>

                                    <div
                                      className={`${scss.bodytask} d-flex mt-3`}
                                    >
                                      <div className="col-sm-4">
                                        {protyId === 1 ? (
                                          <p className="text-danger mt-1 me-3">
                                            {proty}
                                          </p>
                                        ) : protyId === 2 ? (
                                          <p className="text-warning mt-1 me-3">
                                            {proty}
                                          </p>
                                        ) : protyId === 3 ? (
                                          <p className="text-primary mt-1 me-3">
                                            {proty}
                                          </p>
                                        ) : (
                                          <p className="text-success mt-1 me-3">
                                            {proty}
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-sm-8">
                                        <div className="d-flex">
                                          {lstTask.assigness
                                            .slice(0, 2)
                                            .map((assignes) => {
                                              return (
                                                <div className="col-sm-2 mb-1 pe-1 ps-1">
                                                  <img
                                                    className={scss.img}
                                                    src={assignes.avatar}
                                                    alt=""
                                                  />
                                                </div>
                                              );
                                            })}
                                          {lstTask.assigness.length > 2 ? (
                                            <div className="col-sm-2 mb-1 pe-1 ps-1">
                                              <Avatar
                                                style={{
                                                  marginTop: "2px",
                                                  backgroundColor: "white",
                                                  verticalAlign: "middle",
                                                  color: "orangered",
                                                  border: "1px solid orangered",
                                                }}
                                                size="default"
                                                // gap={gap}
                                              >
                                                {lstTask.assigness.length - 2}+
                                              </Avatar>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-12 mt-1">
                                    <div
                                      // style={{ justifyContent: "space-around" }}
                                      className="d-flex"
                                    >
                                      <a
                                        onClick={() =>
                                          UpdateTask(lstTask.taskId)
                                        }
                                        className="  text-primary me-3 text-decoration-none"
                                      >
                                        edit
                                      </a>
                                      <a
                                        className=" text-primary me-3 text-decoration-none"
                                        onClick={() =>
                                          showModalb(lstTask.taskId)
                                        }
                                      >
                                        comment
                                      </a>
                                      <a
                                        className=" text-primary text-decoration-none"
                                        onClick={() =>
                                          showConfirm(
                                            lstTask.taskId,
                                            user.accessToken,
                                            taskId,
                                            lstTask.taskName
                                          )
                                        }
                                      >
                                        delete
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </Tooltip>
                            );
                          })
                          .sort((a, b) => a.priorityId - b.priorityId)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Modal
              cancelButtonProps={{ style: { display: "none" } }}
              okButtonProps={{ style: { display: "none" } }}
              title="Comments"
              open={open}
              onOk={handleOkb}
              confirmLoading={confirmLoading}
              onCancel={handleCancelb}
            >
              <div className={scss.text1}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className={scss.bgcom2}>
                    <textarea
                      id="comment"
                      className="bg-transparent"
                      placeholder="viết bình luận"
                      {...register("contentComment")}
                    />
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    {rederbut ? (
                      <button className="btn btn-success">Update</button>
                    ) : (
                      <button className="btn btn-primary">comment</button>
                    )}
                  </div>
                </form>
              </div>
              <div>
                <div className="row">
                  {comment
                    .map((com) => {
                      return (
                        <div className="d-flex mb-3 ">
                          <div className="me-1">
                            <img
                              className={scss.img}
                              src={com.user.avatar}
                              alt=""
                            />
                          </div>

                          <div>
                            <div className={scss.bgcom}>
                              <p
                                style={{ wordBreak: "break-word" }}
                                className="mt-1 mb-1"
                              >
                                {com.contentComment}
                              </p>
                            </div>
                            <div className={`ms-1 mt-1 ${scss.comacction}`}>
                              {rederbut === com.id ? (
                                <span
                                  onClick={() => {
                                    setRenderbut(false);

                                    setValue("contentComment", "");
                                    setValue("id", "");
                                  }}
                                  className="me-3"
                                >
                                  hoàn tác
                                </span>
                              ) : (
                                <span
                                  onClick={() => {
                                    handleGetdetail(com);
                                    setRenderbut(com.id);
                                  }}
                                  className="me-3"
                                >
                                  chỉnh sửa
                                </span>
                              )}

                              <span
                                onClick={() =>
                                  handleDeleteComment(com.id, acces, com.taskId)
                                }
                              >
                                xóa
                              </span>
                            </div>
                          </div>

                          <div></div>
                        </div>
                      );
                    })
                    .reverse()}
                </div>
              </div>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ListProject;
