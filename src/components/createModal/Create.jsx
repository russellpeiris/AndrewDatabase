import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  FloatButton,
  Form,
  Input,
  Modal,
  Select,
  Tabs,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { createCategory, getCategories } from "../../hooks/category.js";
import { uploadImages } from "../../hooks/images.js";
import { createQnA } from "../../hooks/qna.js";

const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
    lg: {
      span: 4,
    },
    xl: {
      span: 3,
    },
  },
  wrapperCol: {
    span: 24,
  },
};

const Create = ({onClose}) => {
  const [fileList, setFileList] = useState([]);
  const [qnaForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("qna");
  const [isCreating, setIsCreating] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);


  const onFinish = async () => {
    if (activeKey === "qna") {
      const qnaValues = qnaForm.getFieldsValue();
      await qnaForm.validateFields();
      setIsCreating(true);
      try {
        let imageUrls = [];
        if (fileList.length > 0) {
          imageUrls = await uploadImages(fileList);
        }
        await createQnA(qnaValues, imageUrls).then(() => {
          message.success("Q&A added successfully!");
        });
      } catch (error) {
        console.error("Error adding Q&A:", error.message);
      } finally {
        setIsCreating(false);
        handleModalClose();
      }
    } else if (activeKey === "category") {
      const categoryValues = categoryForm.getFieldsValue();
      await categoryForm.validateFields();
      setIsCreating(true);
      try {
        await createCategory(categoryValues).then(() => {
          message.success("Category added successfully!");
        },
        );
      } catch (error) {
        message.error("Error adding category:", error.message);
      } finally {
        setIsCreating(false);
        handleModalClose();
      }
    }
  };

  const handleChange = (info) => {
    const newFileList = info.fileList.slice(-7);
    setFileList(newFileList);

    if (newFileList.length > 7) {
      message.error("You can only upload a maximum of 7 images!");
    }
  };

  const handleRemove = (file) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid));
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
    }
    return isJpgOrPng && isLt5M;
  };

  const handleModalClose = () => {
    setIsOpen(false);
    qnaForm.resetFields();
    categoryForm.resetFields();
    setFileList([]);
    setActiveKey("qna");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      getCategories().then((categories) => {
        setCategoryOptions(categories);
      });
    }
  }, [isOpen]);

  return (
    <>
      <FloatButton
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => setIsOpen(true)}
      />
      <Modal
        title="Create"
        open={isOpen}
        onOk={onFinish}
        okText="Create"
        onCancel={handleModalClose}
        width={"80vw"}
        confirmLoading={isCreating}
      >
        <Tabs activeKey={activeKey} onChange={setActiveKey}>
          <TabPane tab="Q&A" key="qna">
            <Form {...formItemLayout} form={qnaForm} name="create">
              <Form.Item
                label="Question"
                name="question"
                rules={[
                  {
                    required: true,
                    message: "Please enter a question!",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="Answer" name="answer">
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="Category" name="category">
                <Select
                  options={categoryOptions}
                  placeholder="Select a category"
                />
              </Form.Item>

              <Form.Item label="Username" name="username">
                <Input />
              </Form.Item>

              <Form.Item label="Images (Max 7)">
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  onRemove={handleRemove}
                  multiple
                >
                  <Button type="text" icon={<UploadOutlined />} />
                  {fileList.length > 0 && (
                    <ul className="ant-upload-list">
                      {fileList.map((file) => (
                        <li key={file.uid}>
                          <img src={file.url} style={{ width: "100%" }} />
                        </li>
                      ))}
                    </ul>
                  )}
                </Upload>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Category" key="category">
            <Form {...formItemLayout} form={categoryForm} name="createCategory">
              <Form.Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please enter a category!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
export default Create;
