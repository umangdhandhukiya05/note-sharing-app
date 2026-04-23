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
    <div className="px-6 flex justify-between mb-5 items-center bg-black text-white">
      <div className="flex flex-col">
        <h2 className="logo">Shared-Notes</h2>
        <span className="text-lg font-semibold">
          Welcome,{" "}
          <span>{username.toUpperCase()} !</span>
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <Button onClick={handleLogout}>Logout</Button>

        <Button
          style={{ backgroundColor: "white", color: "black" }}
          icon={<PlusOutlined />}
          onClick={onOpenModal}
        >
          New Note
        </Button>
      </div>
    </div>
  );
}
