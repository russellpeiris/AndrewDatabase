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
import { formItemLayout } from "../../constants/formLayout.js";
import { beforeUpload } from "../../helpers/fileHelpers.js";
import { createCategory, getCategories, updateChildCategory } from "../../hooks/category.js";
import { uploadImages } from "../../hooks/images.js";
import { createQnA } from "../../hooks/qna.js";

const { TabPane } = Tabs;

const Create = ({ onClose }) => {
  const [fileList, setFileList] = useState([]);
  const [qnaForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("qna");
  const [isCreating, setIsCreating] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);

  const handleQnA = async () => {
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
  };
  
  const handleCategory = async () => {
    const categoryValues = categoryForm.getFieldsValue();
    await categoryForm.validateFields();
    setIsCreating(true);
    try {
      if (categoryValues.category === "None") {
        const category = parentCategory.find((category) =>
          category.value.toLowerCase() === categoryValues.children.toLowerCase()
        );
        if (category) {
          message.error("Category already exists!");
          return;
        }
        await createCategory(categoryValues.children).then(() => {
          message.success("Category added successfully!");
          setIsCreating(false);
        });
      } else {
        const category = parentCategory.find((category) => category.value === categoryValues.category);
        let children = category.children;
        children.push(categoryValues.children);
        await updateChildCategory(categoryValues.category, children).then(() => {
          message.success("Subcategory updated successfully!");
        });
      }
    } catch (error) {
      message.error("Error adding category:", error.message);
    } finally {
      setIsCreating(false);
      handleModalClose();
    }
  };
  
  const onFinish = async () => {
    if (activeKey === "qna") {
      await handleQnA();
    } else if (activeKey === "category") {
      await handleCategory();
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
        let children = [];
        categories.forEach((category) => {
          children = children.concat(category.children);
        });
        setCategoryOptions(children.map((child) => {
          return {
            label: child,
            value: child,
          };
        }));
      });
    } 
  }, [isOpen]);

  useEffect(() => {
    getCategories().then((parentCategory) => {
      // set category without children
      setParentCategory(parentCategory.map((category) => {
        return {
          label: category.category,
          value: category.category,
          children: category.children.map((child) => {
            return {
              label: child,
              value: child,
            };
          }),
        };
      }));
    });
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
              >
                <Select>
                  <Select.Option value="None">None (Create new main category)</Select.Option>
                  {parentCategory.map((category) => (
                    <Select.Option key={category.value} value={category.value}>
                      {category.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="(Sub) Category"
                name="children"
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
