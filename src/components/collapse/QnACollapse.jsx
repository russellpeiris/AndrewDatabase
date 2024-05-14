import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Collapse,
  Flex,
  Image,
  Modal,
  Row,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { deleteImage } from "../../hooks/images";
import { deleteQnA, getQnAById } from "../../hooks/qna";
import Edit from "../editModal/Edit";
import { ImageLoader } from "../spin/Loader";

const QnACollapse = ({ qna, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedQnA, setSelectedQnA] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => message.success("Copied to clipboard"))
      .catch((error) => message.error("Failed to copy to clipboard"));
  };

  const handleDeleteQnA = async (id) => {
    setIsLoading(true);
    try {
      await getQnAById(id).then((data) => {
        data.images.forEach((image) => {
          deleteImage(image);
        });
      });
      await deleteQnA(id);
      message.success("Q&A deleted successfully!");
    } catch (error) {
      message.error("Error deleting Q&A:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmation = async (q) => {
    await handleDeleteQnA(q);
    onClose();
    setVisible(false);
    setDeleteId(null);
  };
  const items = qna.map((q, index) => {
    return {
      key: index.toString(),
      label: index + 1 + ". " + q.question,
      children: (
        <Flex style={{ flexDirection: "column" }}>
          <Flex style={{ marginBottom: "8px" }}>
            {q.answer && (
              <Tooltip title="Copy to Clipboard">
                <Tag
                  icon={<CopyOutlined />}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCopyToClipboard(q.answer)}
                />
              </Tooltip>
            )}
            {q.username && <Tag color="success">{q.username}</Tag>}
            {q.parentCategory && <Tag>{q.parentCategory}</Tag>}
            {q.subCategory && <Tag>{q.subCategory}</Tag>}
          </Flex>
          <Flex style={{ flexDirection: "column" }}>
            {q.answer && (
              <Typography.Paragraph>{q.answer}</Typography.Paragraph>
            )}
            {q.images && q.images.length > 0 && (
              <Row gutter={16}>
                {q.images.map((image, i) => (
                  <Image
                    key={i}
                    placeholder={<ImageLoader />}
                    src={image}
                    width={300}
                    height={300}
                    style={{ objectFit: "cover", padding: "8px" }}
                  />
                ))}
              </Row>
            )}
          </Flex>
        </Flex>
      ),
      extra: (
        <>
          <Tooltip title="Edit Q&A">
            <Tag
              icon={<EditOutlined />}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                setIsOpen(true);
                setSelectedQnA(q);
                e.stopPropagation();
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Q&A">
            <Tag
              color="danger"
              icon={<DeleteOutlined />}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                setDeleteId(q.id);
                setVisible(true);
                e.stopPropagation();
              }}
            />
          </Tooltip>
          <Modal
            title="Delete Q&A"
            open={visible && deleteId === q.id}
            onOk={() => handleConfirmation(deleteId)}
            onCancel={() => setVisible(false)}
            okText="Delete"
            confirmLoading={isLoading}
            cancelText="Cancel"
            okType="danger"
          />
        </>
      ),
    };
  });

  return (
    <>
      <Collapse accordion items={items} />
      <Edit
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={selectedQnA}
        onClose={onClose}
      />
    </>
  );
};

export default QnACollapse;
