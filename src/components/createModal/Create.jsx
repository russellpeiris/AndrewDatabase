import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
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
} from 'antd';
import { useState } from 'react';
import { db } from '../../configs/firebaseConfig.js'
import { addDoc, collection } from 'firebase/firestore';
import { useLoader } from '../../context/loader/index.jsx';


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

const Create = () => {
    const [fileList, setFileList] = useState([]);
    const [qnaForm] = Form.useForm();
    const [categoryForm] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    const [activeKey, setActiveKey] = useState('qna');
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async () => {
        setIsLoading(true);
        const qnaValues = qnaForm.getFieldsValue();
        const categoryValues = categoryForm.getFieldsValue();
        const categoryRef = collection(db, "categories")

        if (activeKey === 'qna') {
            console.log('Q&A Form:', qnaValues);
        } else if (activeKey === 'category') {
            try {
                await addDoc(categoryRef,
                    { category: categoryValues.category }
                ).then(() => {
                    message.success('Category added successfully!');

                });
            } catch (error) {
                message.error('Error adding category:', error.message);
            } finally {
                setIsLoading(false);
                categoryForm.resetFields();
                setIsOpen(false);
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleChange = (info) => {
        const newFileList = info.fileList.slice(-7); // Limit to 7 images
        setFileList(newFileList);

        if (newFileList.length > 7) {
            message.error('You can only upload a maximum of 7 images!');
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    return (
        <>
            <FloatButton type="primary" icon={<PlusCircleOutlined />} onClick={() => setIsOpen(true)} />
            <Modal
                title="Create"
                open={isOpen}
                onOk={onFinish}
                okText="Create"
                onCancel={() => setIsOpen(false)}
                width={'80vw'}
                confirmLoading={isLoading}
            >
                <Tabs activeKey={activeKey} onChange={setActiveKey}>
                    <TabPane tab="Q&A" key="qna">
                        <Form {...formItemLayout} form={qnaForm} name="create" onFinishFailed={onFinishFailed}>
                            <Form.Item
                                label="Question"
                                name="question"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a question!',
                                    },
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item label="Answer" name="answer">
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item label="Category" name="category">
                                <Select />
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
                                    multiple
                                >
                                    <Button type="text" icon={<UploadOutlined />} />
                                    {fileList.length > 0 && (
                                        <ul className="ant-upload-list">
                                            {fileList.map((file) => (
                                                <li key={file.uid}>
                                                    <img src={file.url} style={{ width: '100%' }} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="Category" key="category">
                        {/* Add your form for creating categories here */}
                        <Form {...formItemLayout} form={categoryForm} name="createCategory">
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a category!',
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
}
export default Create;