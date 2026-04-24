"use client";

import { Form, Input, Button, Card, message } from "antd";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type authValues = {
  email: string;
  password: string;
};

import Link from "next/link";

const Register = () => {
  const router = useRouter();

  const onFinish = async (values: authValues) => {
    const { email, password } = values;

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.log(authError);
      message.error(authError.message);
      return;
    }

    message.success("account created successfully");
    router.push("/");
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <Card title="Register" style={{ width: 350 }}>
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

          <Button type="primary" htmlType="submit" block style={{ background: "black", borderColor: "black", color: "white" }}>
            Register
          </Button>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            Already have an account? <Link href="/login" style={{ color: "black", fontWeight: "bold" }}>Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
