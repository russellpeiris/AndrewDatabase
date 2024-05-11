import { Collapse, Flex, Input, Select } from "antd";
import { useState } from "react";
import QnACollapse from "../../components/collapse/QnACollapse";

const Home = ({  onSearch, onFilter }) => {

  const questions = [
    {
      question: "What is the capital of France?",
      answer: "Paris is the capital of France.",
      category: "Geography",
      username: "John Doe",
      images: ['https://randomwordgenerator.com/img/picture-generator/53e8dd4b4c4faa0df7c5d57bc32f3e7b1d3ac3e45659794b7d287bd793_640.jpg', 'https://picsum.photos/200', 'https://picsum.photos/200'], // Add image URLs if needed
    },
    {
      question: "What is the meaning of life?",
      answer: "That's a philosophical question with no single answer. It depends on your individual beliefs and values.",
      category: "Philosophy",
      username: "Jane Smith",
      images: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
    },
    {
      question: "How do I write effective JavaScript code?",
      answer: "There are many aspects to writing effective JavaScript code. Here are some key points: Use clear and concise variable and function names. Follow consistent coding conventions. Write modular code that is easy to understand and maintain. Utilize comments to explain complex logic. Consider using libraries and frameworks to simplify common tasks.",
      category: "Programming",
      username: "Anonymous",
      images: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200'],
    },
    {
      question: "What are the best practices for responsive web design?",
      answer: "Responsive web design ensures your website adapts to different screen sizes and devices. Here are some best practices: Use media queries to adjust styles based on screen size. Employ flexible layouts with units like percentages or viewport units. Consider responsive images that adjust based on device resolution. Test your website across various devices and browsers.",
      category: "Web Development",
      username: "Sarah Lee",
      images: [],
    },
  ];
  
  
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    const filtered = questions.filter((q) =>
      q.question.toLowerCase().includes(searchTerm)
    );
    setFilteredQuestions(filtered);
  };


  const handleFilter = (value) => {
    setSelectedCategory(value);
    const filtered = questions.filter((q) => {
      if (value === 'all') return true;
      return q.category === value;
    });
    setFilteredQuestions(filtered);
  };

  return (
    <Flex style={{
      flexDirection: 'column',
      padding: 16,
    }}>
      <Input.Search
        placeholder="Search questions"
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Select defaultValue="all" onChange={handleFilter} style={{width: 'fit-content', marginBottom: 16}}>
        <Select.Option value="all">All Categories</Select.Option>
        {questions.map((q) => (
          <Select.Option key={q.category} value={q.category}>
            {q.category}
          </Select.Option>
        ))}
      </Select>
      <QnACollapse qna={filteredQuestions} />
    </Flex>
  );
};


export default Home;
