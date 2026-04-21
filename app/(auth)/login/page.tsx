"use client";

import { Form, Input, Button, Card, message } from "antd";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type authValues = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();

  const onFinish = async (values: authValues) => {
    const { email, password } = values;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      message.error(error.message);
      return;
    }

    router.push("/");
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

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
