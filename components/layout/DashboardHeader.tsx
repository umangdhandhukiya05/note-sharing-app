"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  onOpenModal: () => void;
}

export function DashboardHeader({ onOpenModal }: DashboardHeaderProps) {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userData.user.id)
      .single();

    if (!error && data) {
      setUsername(data.display_name);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
        alignItems: "center",
      }}
    >
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">Shared-Notes</h2>
        <span className="text-lg font-semibold">
          Welcome,{" "}
          <span style={{ color: "orange" }}>{username.toUpperCase()} !</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
        <Button onClick={handleLogout}>Logout</Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={onOpenModal}>
          New Note
        </Button>
      </div>
    </div>
  );
}
