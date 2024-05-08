import { Layout, Typography } from "antd";
import Create from "../../pages/create/Create";

const { Header } = Layout;

const AntdHeader = () => {
  return (
    <Header
      style={{
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Typography.Title
        className="logo-andrew"
        level={3}
        style={{ color: "white", marginBottom: "0" }}
      >
        Andrew Database
      </Typography.Title>
      <Create/>
    </Header>
  );
};

export default AntdHeader;
