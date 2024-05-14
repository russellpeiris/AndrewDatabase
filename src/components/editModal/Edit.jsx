import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { formItemLayout } from "../../constants/formLayout";
import { beforeUpload } from "../../helpers/fileHelpers";
import { getCategories } from "../../hooks/category";
import { deleteImage, uploadImages } from "../../hooks/images";
import { updateQnA } from "../../hooks/qna";

const Edit = ({ isOpen, setIsOpen, data, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [qnaForm] = Form.useForm();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [limit, setLimit] = useState(7);
  const [currentImage, setCurrentImage] = useState(null);
  const [parentCategory, setParentCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleModalClose = () => {
    setIsOpen(false);
    setFileList([]);
    qnaForm.resetFields();
    setExistingImages([]);
    onClose();
  };

  const onFinish = async () => {
    const qnaValues = qnaForm.getFieldsValue();
    await qnaForm.validateFields();
    setIsUpdating(true);
    try {
      let imageUrls = [];
      if (fileList.length > 0) {
        imageUrls = await uploadImages(fileList);
      }
      imageUrls = [...existingImages, ...imageUrls];
      await updateQnA(data.id, qnaValues, imageUrls)
        .then(() => {
          currentImage && deleteImage(currentImage);
          message.success("Q&A updated successfully!");
        })
        .catch((error) => {
          message.error("Error updating Q&A:", error.message);
        });
    } catch (error) {
      console.error("Error updating Q&A:", error.message);
    } finally {
      setIsUpdating(false);
      handleModalClose();
    }
  };

  const handleChange = (info) => {
    const newFileList = info.fileList.slice(-limit);
    setFileList(newFileList);

    if (newFileList.length > limit) {
      message.error(`Only 7 images allowed!`);
    }
  };

  const handleRemove = (file) => {
    setFileList((fileList) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return newFileList;
    });
  };

  useEffect(() => {
    if (isOpen) {
      qnaForm.setFieldsValue({
        question: data.question,
        answer: data.answer,
        parentCategory: data.parentCategory,
        subCategory: data.subCategory,
        username: data.username,
      });
      setExistingImages(data.images);
      setLimit(7 - data.images.length);
      getCategories().then((categories) => {
        setParentCategory(
          categories.map((category) => ({
            label: category.parentCategory,
            value: category.parentCategory,
          })),
        );
        setCategories(categories);
      });
    }
  }, [data, isOpen]);

  const handleDeleteImage = async (imageUrl) => {
    setExistingImages((images) => images.filter((image) => image !== imageUrl));
    setLimit((limit) => limit + 1);
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

  return (
    <Modal
      title="Update Q&A"
      open={isOpen}
      onOk={onFinish}
      okText="Update"
      onCancel={handleModalClose}
      width={"80vw"}
      confirmLoading={isUpdating}
    >
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
            <Select options={categoryOptions} placeholder="Select a category" />
          </Form.Item>
        )}

        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

        {existingImages.length > 0 && (
          <Form.Item label="Existing Images">
            <Row gutter={8}>
              {existingImages.map((imageUrl, index) => (
                <Col key={index}>
                  <Popconfirm
                    title="Are you sure you want to delete this image?"
                    onConfirm={() => {
                      setCurrentImage(imageUrl);
                      handleDeleteImage(imageUrl);
                    }}
                    placement="top"
                    okText="Yes"
                    cancelText="No"
                    okType="danger"
                  >
                    <Image
                      src={imageUrl}
                      preview={false}
                      style={{ width: 60, objectFit: "cover", height: 60 }}
                    />
                    <Button
                      type="ghost"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      style={{ position: "absolute", top: 0, right: 0 }}
                    />
                  </Popconfirm>
                </Col>
              ))}
            </Row>
          </Form.Item>
        )}

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
    </Modal>
  );
};

export default Edit;
