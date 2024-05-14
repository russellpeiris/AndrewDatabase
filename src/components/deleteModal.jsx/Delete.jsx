import { DeleteOutlined } from "@ant-design/icons";
import { FloatButton, Form, Modal, Select, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { formItemLayout } from "../../constants/formLayout.js";
import {
  deleteCategory,
  getCategories,
  updateChildCategory,
} from "../../hooks/category.js";

const Delete = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [parentCategory, setParentCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catForm] = Form.useForm();

  const onFinish = async () => {
    try {
      setIsDeleting(true);
      await catForm.validateFields();
      const values = catForm.getFieldsValue();
      if (values.subCategory === "all") {
        await deleteCategory(values.parentCategory);
      } else {
        const category = categories.find(
          (cat) => cat.parentCategory === values.parentCategory,
        );
        const subCategories = category.subCategories.filter(
          (subCategory) => subCategory !== values.subCategory,
        );
        await updateChildCategory(values.parentCategory, subCategories);
      }
      message.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error.message);
    } finally {
      setIsDeleting(false);
      handleModalClose();
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
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
        icon={<DeleteOutlined />}
        className="delete-floating-button"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        title="Delete"
        open={isOpen}
        onOk={onFinish}
        okText="Delete"
        onCancel={handleModalClose}
        width={"80vw"}
        confirmLoading={isDeleting}
      >
        <Form {...formItemLayout} form={catForm} name="delete_categories">
          <Form.Item
            label="Parent Category"
            name="parentCategory"
            rules={[
              {
                required: true,
                message: "Please select a category",
              },
            ]}
          >
            <Select
              placeholder="Select a category"
              options={parentCategory}
              onChange={handleSubCategory}
            />
          </Form.Item>
          <Form.Item
            label="Sub Category"
            name="subCategory"
            rules={[
              {
                required: true,
                message: "Please select a sub category",
              },
            ]}
          >
            <Select placeholder="Select a sub category">
              <Select.Option value="all">
                Delete all under parent category
              </Select.Option>
              {categoryOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Delete;
