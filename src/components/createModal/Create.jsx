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
import {
  createCategory,
  getCategories,
  updateChildCategory,
} from "../../hooks/category.js";
import { uploadImages } from "../../hooks/images.js";
import { createQnA } from "../../hooks/qna.js";

const { TabPane } = Tabs;

const Create = ({ onClose }) => {
  const [qnaForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("qna");
  const [isCreating, setIsCreating] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleQnA = async () => {
    const qnaValues = qnaForm.getFieldsValue();
    await qnaForm.validateFields();
    setIsCreating(true);
    try {
      const imageUrls = fileList.length > 0 ? await uploadImages(fileList) : [];
      await createQnA(qnaValues, imageUrls);
      message.success("Q&A added successfully!");
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
      if (
        categoryValues.existingCategory === "None" ||
        categoryValues.existingCategory === undefined
      ) {
        const exists = parentCategory.some(
          (category) =>
            category.value.toLowerCase() ===
            categoryValues.newCategory.toLowerCase(),
        );
        if (exists) {
          message.error("Category already exists!");
          return;
        }
        await createCategory(categoryValues.newCategory);
        message.success("Category added successfully!");
      } else {
        const category = categories.find(
          (cat) => cat.parentCategory === categoryValues.existingCategory,
        );
        const updatedChildren = [
          ...category.subCategories,
          categoryValues.newCategory,
        ];
        await updateChildCategory(
          categoryValues.existingCategory,
          updatedChildren,
        );
        message.success("Subcategory updated successfully!");
      }
    } catch (error) {
      message.error("Error adding category:", error.message);
    } finally {
      setIsCreating(false);
      handleModalClose();
    }
  };

  const onFinish = async () => {
    if (activeKey === "qna") await handleQnA();
    else if (activeKey === "category") await handleCategory();
  };

  const handleFileChange = (info) => {
    const newFileList = info.fileList.slice(-7);
    setFileList(newFileList);
    if (newFileList.length > 7)
      message.error("You can only upload a maximum of 7 images!");
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

  const handleSubCategory = (value) => {
    const category = categories.find((cat) => cat.parentCategory === value);
    setCategoryOptions(
      category.subCategories.map((subCategories) => ({
        label: subCategories,
        value: subCategories,
      })),
    );
  };

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
      setParentCategory(
        categories.map((cat) => ({
          label: cat.parentCategory,
          value: cat.parentCategory,
          subCategories: cat.subCategories.map((subCategory) => ({
            label: subCategory,
            value: subCategory,
          })),
        })),
      );
    });
  }, []);

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

              <Form.Item label="Parent Category" name="parentCategory">
                <Select
                  options={parentCategory}
                  onChange={handleSubCategory}
                  placeholder="Select a category"
                />
              </Form.Item>

              {categoryOptions.length > 0 && (
                <Form.Item label="Subcategory" name="subCategory">
                  <Select
                    options={categoryOptions}
                    placeholder="Select a category"
                  />
                </Form.Item>
              )}

              <Form.Item label="Username" name="username">
                <Input />
              </Form.Item>

              <Form.Item label="Images (Max 7)">
                <Upload
                  name="images"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleFileChange}
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
              <Form.Item label="Existing Category" name="existingCategory">
                <Select>
                  <Select.Option value="None">
                    None (Create new main category)
                  </Select.Option>
                  {parentCategory.map((category) => (
                    <Select.Option key={category.value} value={category.value}>
                      {category.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="New Category"
                name="newCategory"
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
