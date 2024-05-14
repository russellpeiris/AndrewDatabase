import { Flex, FloatButton, Input } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import QnACollapse from "../../components/collapse/QnACollapse";
import Create from "../../components/createModal/Create";
import Delete from "../../components/deleteModal.jsx/Delete";
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
      const filtered = qna.filter(
        (q) => q.parentCategory === value || q.subCategory === value,
      );
      setFilteredQuestions(filtered);
    }
  };

  const transformedCategories = [
    {
      key: "all",
      label: "All Categories",
    },
    ...categories,
  ];

  useEffect(() => {
    getCategories().then((categories) => {
      categories.map((category) => {
        category.key = category.parentCategory;
        category.label = category.parentCategory;
        category.children = category.subCategories.map((child) => {
          return {
            key: child,
            label: child,
          };
        });
        setCategories(categories);
      });
    });

    getAllQnA().then((qna) => {
      qna.sort((a, b) => b.createdAt - a.createdAt);
      setQna(qna);
      setFilteredQuestions(qna);
    });
  }, [toggleModal]);

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

      <FloatButton.Group>
        <Create onClose={() => setToggleModal(!toggleModal)} />
        <Delete onClose={() => setToggleModal(!toggleModal)} />
      </FloatButton.Group>
    </>
  );
};

export default Home;
