import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Input, Modal, Row, Select, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { formItemLayout } from "../../constants/formLayout";
import { beforeUpload } from "../../helpers/fileHelpers";
import { getCategories } from "../../hooks/category";
import { uploadImages } from "../../hooks/images";
import { updateQnA } from "../../hooks/qna";

const Edit = ({ isOpen, setIsOpen, data, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [qnaForm] = Form.useForm();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [limit, setLimit] = useState(7);

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
      await updateQnA(data.id, qnaValues, imageUrls).then(() => {
        message.success("Q&A updated successfully!");
      }).catch((error) => {
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
        category: data.category,
        username: data.username,
      });
      setExistingImages(data.images);
      setLimit(7 - data.images.length);
      getCategories().then((categories) => {
        setCategoryOptions(categories);
      });
    }
  }, [data, isOpen]);

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

        <Form.Item label="Category" name="category">
          <Select options={categoryOptions} placeholder="Select a category" />
        </Form.Item>

        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>

        {
          existingImages.length > 0 && (
            <Form.Item label="Existing Images">
              <Row gutter={8}>
                {existingImages.map((imageUrl, index) => (
                  <Col key={index}>
                    <Image src={imageUrl} style={{ width: 60, objectFit: 'cover', height: 60 }} />
                  </Col>
                ))}
              </Row>
            </Form.Item>
          )
        }

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
