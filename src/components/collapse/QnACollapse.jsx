import { CopyOutlined } from '@ant-design/icons';
import { Col, Collapse, Flex, Image, Row, Spin, Tag, Tooltip, Typography, message } from 'antd';
import { ImageLoader } from '../spin/Loader';

const QnACollapse = ({ qna }) => {
    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => message.success('Copied to clipboard'))
            .catch((error) => message.error('Failed to copy to clipboard'));
    };

    const items = qna.map((q, index) => {
        return {
            key: index.toString(),
            label: (index + 1) + '. ' + q.question,
            children: (
                <Flex style={{ flexDirection: 'column' }}>
                    <Flex>
                        <Tooltip title="Copy to Clipboard">
                            <Tag icon={<CopyOutlined />} style={{ cursor: 'pointer' }}
                                onClick={() => handleCopyToClipboard(q.answer)}></Tag>
                        </Tooltip>
                        <Tag color='success'>{q.username}</Tag>
                        <Tag>{q.category}</Tag>
                    </Flex>
                    <Flex style={{ flexDirection: 'column' }}>
                        <Typography.Paragraph>{q.answer}</Typography.Paragraph>
                        {q.images && q.images.length > 0 && (
                            <Row gutter={16}>
                                {q.images.map((image, i) => (
                                    <Col key={i} span={24} xs={8} md={6} lg={4}>
                                        <Image  placeholder={<ImageLoader/>} src={image} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Flex>


                </Flex>
            ),
        };
    });

    return (
        <>
            <Collapse accordion items={items} />
        </>
    );
};

export default QnACollapse;
