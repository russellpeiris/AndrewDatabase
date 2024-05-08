import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
    Button,
    FloatButton,
    Form,
    Input,
    Modal,
    Select,
    Upload,
    message
} from 'antd';
import { useState } from 'react';
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        span: 24
    },
};

const Create = () => {
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);

    const onFinish = (values) => {
        console.log('Success:', values);
        // Submit the form data to your backend here
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
            <FloatButton type="primary"
                icon={<PlusCircleOutlined />} onClick={() => setIsOpen(true)} />
            <Modal
                title="Create Question"
                open={isOpen}
                onOk={onFinish}
                okText="Create"
                onCancel={() => setIsOpen(false)}

            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="create"
                    onFinishFailed={onFinishFailed}
                    variant="filled"
                    layout='vertical'
                >
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

                    <Form.Item
                        label="Answer"
                        name="answer"
                    >
                        <Input.TextArea />
                    </Form.Item>


                    <Form.Item
                        label="Category"
                        name="category"
                    >
                        <Select />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                    >
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
                            <Button type='text' icon={< UploadOutlined />} />
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
            </Modal>
        </>
    )
}

export default Create