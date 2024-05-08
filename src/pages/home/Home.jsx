import { Collapse, Input, Select } from "antd";
import { useState } from "react";

const QuestionPanel = ({ question, answer }) => (
  <Collapse.Panel header={question} key={question}>
    <p>{answer}</p>
  </Collapse.Panel>
);

const Home = ({  onSearch, onFilter }) => {

  const questions = [
    {
      question: "What is the capital of France?",
      answer: "Paris is the capital of France.",
      category: "Geography",
      username: "John Doe",
      images: [], // Add image URLs if needed
    },
    {
      question: "What is the meaning of life?",
      answer: "That's a philosophical question with no single answer. It depends on your individual beliefs and values.",
      category: "Philosophy",
      username: "Jane Smith",
      images: [],
    },
    {
      question: "How do I write effective JavaScript code?",
      answer: "There are many aspects to writing effective JavaScript code. Here are some key points: \n * Use clear and concise variable and function names. \n * Follow consistent coding conventions. \n * Write modular code that is easy to understand and maintain. \n * Utilize comments to explain complex logic. \n * Consider using libraries and frameworks to simplify common tasks.",
      category: "Programming",
      username: "Anonymous",
      images: [],
    },
    {
      question: "What are the best practices for responsive web design?",
      answer: "Responsive web design ensures your website adapts to different screen sizes and devices. Here are some best practices: \n * Use media queries to adjust styles based on screen size. \n * Employ flexible layouts with units like percentages or viewport units. \n * Consider responsive images that adjust based on device resolution. \n * Test your website across various devices and browsers.",
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
    <div>
      <Input.Search
        placeholder="Search questions"
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <Select defaultValue="all" onChange={handleFilter}>
        <Select.Option value="all">All Categories</Select.Option>
        {/* Dynamically add options based on available categories */}
        {questions.map((q) => (
          <Select.Option key={q.category} value={q.category}>
            {q.category}
          </Select.Option>
        ))}
      </Select>
      <Collapse accordion>
        {filteredQuestions.map((q) => (
          <QuestionPanel key={q.question} question={q.question} answer={q.answer} />
        ))}
      </Collapse>
    </div>
  );
};


export default Home;
