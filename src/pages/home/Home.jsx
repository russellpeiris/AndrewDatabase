import { Flex, Input } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import QnACollapse from "../../components/collapse/QnACollapse";
import Create from "../../components/createModal/Create";
import Menu from "../../components/menu/Menu";
import { Loader } from "../../components/spin/Loader";
import { getCategories } from "../../hooks/category";
import { getAllQnA } from "../../hooks/qna";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [qna, setQna] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState(qna);
  const { isLoading } = useQuery("qna", getAllQnA);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      setFilteredQuestions(qna);
    } else {
      const filtered = qna.filter((q) =>
        q.question.toLowerCase().includes(searchTerm),
      );
      setFilteredQuestions(filtered);
    }
  };

  const handleFilter = (value) => {
    if (value === "all") {
      setFilteredQuestions(qna); 
    } else {
      const filtered = qna.filter((q) => q.category === value);
      setFilteredQuestions(filtered);
    }
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

  const transformedCategories = [
    {
      key: 'all',
      label: 'All Categories'
    },
    ...categories.map(category => {
      if (category.children && category.children.length > 0) {
        return {
          key: `sub${category.value}`,
          label: category.label,
          children: category.children.map(child => ({
            key: child.value,
            label: child.label
          }))
        };
      } else {
        return {
          key: category.value,
          label: category.label
        };
      }
    })
  ];



  return (
    <>
      <Flex>
        <Menu menuItems={transformedCategories} onItemClick={handleFilter} />
        <Flex
          style={{
            flexDirection: "column",
            padding: 16,
            flex: 1,
          }}
        >
          <Input.Search
            placeholder="Search questions"
            onChange={handleSearch}
            style={{ marginBottom: 16 }}
          />
          {isLoading ? (
            <Loader />
          ) : (
            <QnACollapse
              qna={filteredQuestions}
              onClose={() => setToggleModal(!toggleModal)}
            />
          )}
        </Flex>
      </Flex>
      <Create onClose={() => setToggleModal(!toggleModal)} />
    </>
  );
};

export default Home;
