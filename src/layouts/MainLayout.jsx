// layouts/MainLayout.jsx  (your layout + user menu with logout)
import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Space, Switch, Typography, theme } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { Link, Outlet, useNavigate } from "react-router";
import { useAppTheme } from "../providers/ThemeProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
// import { useAuth } from "../providers/AuthProvider";
const { Sider, Header, Content } = Layout;

const getItem = (label, key, icon, children) => ({ key, icon, children, label });
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

const logoutApi = async () => {
   const { data } = await axios.post('/logout', { credentials: 'include' });
   return data;
}

const items = [
   getItem(<Link to="/">Home</Link>, "1", <MdOutlineDashboardCustomize />),
   getItem("Option 2", "2", null, [
      getItem("Sub 1", "11", null),
      getItem("Sub 2", "12", null),
      getItem("Sub 3", "13", null),
   ]),
   getItem("Option 3", "3", null),
];

export default function MainLayout() {
   const { mode, toggleMode } = useAppTheme();
   const { logout } = useAuth();
   // const { user, logout } = useAuth();
   const navigate = useNavigate();
   const {
      token: { colorBgContainer, borderRadiusLG },
   } = theme.useToken();

   const useLogin = useMutation({
      mutationFn: logoutApi,
      onSuccess: (data) => {
         console.info(data);
      }
   });

   const userMenu = {
      items: [
         {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Sign out",
            onClick: async () => {
               try {
                  await logout();
               } catch (error) {
                  console.error(error)
               }
               navigate("/", { replace: true });
            },
         },
      ],
   };

   return (
      <Layout style={{ minHeight: "100vh" }}>
         <Sider collapsible collapsed={false} onCollapse={() => null}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
         </Sider>
         <Layout>
            <Header style={{ padding: "0 24px", background: colorBgContainer }}>
               <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 24, height: "100%" }}>
                  <Switch checked={mode === "dark"} onChange={toggleMode} checkedChildren="Dark" unCheckedChildren="Light" />
                  <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
                     <Space style={{ cursor: "pointer" }}>
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Typography.Text>{'Sample User'}</Typography.Text>
                     </Space>
                  </Dropdown>
               </div>
            </Header>
            <Content style={{ padding: "24px 48px" }}>
               <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Home" }]} />
               <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                  <Outlet />
               </div>
            </Content>
         </Layout>
      </Layout>
   );
}