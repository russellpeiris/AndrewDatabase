import { CopyOutlined } from '@ant-design/icons';
import { Collapse, Flex, Image, Row, Tag, Tooltip, Typography, message } from 'antd';
import { ImageLoader } from '../spin/Loader';

const QnACollapse = ({ qna }) => {
    const isMobile = window.innerWidth < 768;
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
                    <Flex style={{ marginBottom: '8px' }}>
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
                                    <Image key={i} placeholder={<ImageLoader />} src={image}
                                        width={300}
                                        height={300}
                                        style={{ objectFit: 'cover',padding: '8px'}}
                                         />
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
