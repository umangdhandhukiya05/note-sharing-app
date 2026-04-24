"use client";

import { Form, Input, Button, Card, message } from "antd";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type authValues = {
  email: string;
  password: string;
};

import Link from "next/link";

const Login = () => {
  const router = useRouter();

  const onFinish = async (values: authValues) => {
    const { email, password } = values;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      message.error(error.message);
      return;
    }
    message.success("Login successfully");
    router.replace("/");
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <Card title="Login" style={{ width: 350 }} variant="outlined">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              background: "black",
              borderColor: "black",
              color: "white",
            }}
          >
            Login
          </Button>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            Don't have an account?{" "}
            <Link
              href="/register"
              style={{ color: "black", fontWeight: "bold" }}
            >
              Register
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
