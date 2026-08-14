import { Breadcrumb, Layout, Menu, Switch, theme } from "antd";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { useAppTheme } from "../providers/ThemeProvider";
import { Link, Outlet } from "react-router";
const { Sider, Header, Content } = Layout;

const getItem = (label, key, icon, children) => ({
   key,
   icon,
   children,
   label,
});

const items = [
   getItem(<Link to="/">Home</Link>, '1', <MdOutlineDashboardCustomize />),
   getItem('Option 2', '2', null, [
      getItem('Sub 1', '11', null),
      getItem('Sub 2', '12', null),
      getItem('Sub 3', '13', null),
   ]),
   getItem('Option 3', '3', null)
]

export default function MainLayout() {
   const { mode, toggleMode } = useAppTheme();
   const {
      token: { colorBgContainer, colorBgLayout, borderRadiusLG },
   } = theme.useToken();

   return (
      <Layout style={{ minHeight: '100vh' }}>
         <Sider collapsible collapsed={false} onCollapse={val => null}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
         </Sider>
         <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
               <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "24px" }}>
                  <Switch checked={mode === "dark"} onChange={toggleMode} checkedChildren="Dark" unCheckedChildren="Light" />
               </div>
            </Header>
            <Content style={{ padding: '24px 48px' }}>
               <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Home' }]} />
               <div
                  style={{
                     padding: 24,
                     minHeight: 360,
                     background: colorBgContainer,
                     borderRadius: borderRadiusLG,
                  }}
               >
                  <Outlet />
               </div>
            </Content>
         </Layout>
      </Layout>
   )
}