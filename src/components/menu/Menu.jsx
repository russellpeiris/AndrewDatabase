import { Menu as AntDMenu } from 'antd';

const Menu = ({ menuItems, onItemClick }) => {
  const handleItemClick = (item) => {
    onItemClick(item.key);
  };

  return (
    <div style={{ margin: '16px 0px 16px 16px' }}>
      <AntDMenu
        style={{
          backgroundColor: '#25242B',
          borderRadius: '8px',
          border: '1.3px solid rgba(62, 67, 62, 0.632)'
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        onClick={handleItemClick} 
      >
        {menuItems.map(item => (
          item.children ? (
            <AntDMenu.SubMenu key={item.key} title={item.label}>
              {item.children.map(child => (
                <AntDMenu.Item key={child.key}>{child.label}</AntDMenu.Item>
              ))}
            </AntDMenu.SubMenu>
          ) : (
            <AntDMenu.Item key={item.key}>{item.label}</AntDMenu.Item>
          )
        ))}
      </AntDMenu>
    </div>
  );
};

export default Menu;
