// pages/Login.jsx
import { useState } from "react";
import { Alert, Button, Card, Checkbox, Flex, Form, Input, Switch, Typography, theme } from "antd";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAppTheme } from "../providers/ThemeProvider";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";

const { Title, Text } = Typography;

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   withCredentials: true, // required for the cookie
});

const loginApi = async (payload) => {
   const { data } = await api.post('/login', payload);
   return data;
}

export default function Login() {
   const { mode, toggleMode } = useAppTheme();
   const {
      token: { colorBgLayout, colorPrimary, borderRadiusLG },
   } = theme.useToken();
   const { login } = useAuth();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const useLogin = useMutation({
      mutationFn: loginApi,
      onSuccess: (data) => {
         console.info(data);
      }
   })

   const onFinish = async values => {
      setLoading(true);
      setError(null);
      try {
         await login(values);
         navigate("/home", { replace: true });
      } catch (err) {
         setError(err.message || "Something went wrong. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <Flex
         align="center"
         justify="center"
         style={{ minHeight: "100vh", padding: 24, background: colorBgLayout, position: "relative" }}
      >
         <div style={{ position: "absolute", top: 24, right: 24 }}>
            <Switch checked={mode === "dark"} onChange={toggleMode} checkedChildren="Dark" unCheckedChildren="Light" />
         </div>

         <Card style={{ width: "100%", maxWidth: 400, borderRadius: borderRadiusLG }} styles={{ body: { padding: 32 } }}>
            <Flex vertical align="center" gap={4} style={{ marginBottom: 24 }}>
               <MdOutlineDashboardCustomize size={36} color={colorPrimary} />
               <Title level={3} style={{ margin: 0 }}>Sign in</Title>
               <Text type="secondary">Welcome back to the My Playground</Text>
            </Flex>

            {error && (
               <Alert type="error" message={error} showIcon closable onClose={() => setError(null)} style={{ marginBottom: 16 }} />
            )}

            <Form layout="vertical" initialValues={{ remember: true }} onFinish={onFinish} requiredMark={false} size="large">
               <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                     { required: true, message: "Enter your email" },
                     { type: "email", message: "Enter a valid email address" },
                  ]}
               >
                  <Input prefix={<UserOutlined />} placeholder="you@example.com" autoComplete="email" />
               </Form.Item>

               <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter your password" }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" autoComplete="current-password" />
               </Form.Item>

               <Form.Item>
                  <Flex justify="space-between" align="center">
                     <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                     </Form.Item>
                     <a href="#forgot" onClick={e => e.preventDefault()}>Forgot password?</a>
                  </Flex>
               </Form.Item>

               <Button type="primary" htmlType="submit" block loading={loading}>
                  Sign in
               </Button>
            </Form>

            <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 16 }}>
               Demo: admin@example.com / password
            </Text>
         </Card>
      </Flex>
   );
}