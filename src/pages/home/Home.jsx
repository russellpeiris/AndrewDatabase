import { Flex, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import QnACollapse from "../../components/collapse/QnACollapse";
import Create from "../../components/createModal/Create";
import { Loader } from "../../components/spin/Loader";
import { getCategories } from "../../hooks/category";
import { getAllQnA } from "../../hooks/qna";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [qna, setQna] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState(qna);
  const { isLoading } = useQuery("qna", getAllQnA);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      setFilteredQuestions(qna); 
    } else {
      const filtered = qna.filter((q) =>
        q.question.toLowerCase().includes(searchTerm)
      );
      setFilteredQuestions(filtered);
    }
  };

  const handleFilter = (value) => {
    setSelectedCategory(value);
    const filtered = qna.filter((q) => {
      if (value === "all") return true;
      return q.category === value;
    });
    setFilteredQuestions(filtered);
  };

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    });

    getAllQnA().then((qna) => {
      //sort by latest
      qna.sort((a, b) => b.createdAt - a.createdAt);
      setQna(qna);
      setFilteredQuestions(qna);
    });
  }, [toggleModal]);

  return (
    <>
      <Flex
        style={{
          flexDirection: "column",
          padding: 16,
        }}
      >
        <Input.Search
          placeholder="Search questions"
          onChange={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Select
          defaultValue="all"
          onChange={handleFilter}
          style={{ width: "fit-content", marginBottom: 16 }}
        >
          <Select.Option value="all">All Categories</Select.Option>
          {categories.map((c) => (
            <Select.Option key={c.value} value={c.value}>
              {c.label}
            </Select.Option>
          ))}
        </Select>
        {isLoading ? <Loader /> : <QnACollapse qna={filteredQuestions} onClose={() => setToggleModal(!toggleModal)}/>}
      </Flex>
      <Create onClose={() => setToggleModal(!toggleModal)} />
    </>
  );
};

export default Home;
