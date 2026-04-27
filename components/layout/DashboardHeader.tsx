"use client";

import { Button } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
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
    <div className="px-4 py-3 md:px-6 md:py-4 flex justify-between mb-5 items-center bg-black text-white">
      <div className="flex flex-col">
        <h2 className="logo m-0 text-lg md:text-xl">S-Notes</h2>
        <span className="text-sm md:text-lg font-semibold mt-1">
          Welcome,{" "}
          <span>{username.toUpperCase()} !</span>
        </span>
      </div>

      <div className="flex gap-2 md:gap-4 items-center">
        <Button onClick={handleLogout} className="flex items-center" title="Logout">
          <LogoutOutlined />
          <span className="hidden md:inline">Logout</span>
        </Button>

        <Button
          style={{ backgroundColor: "white", color: "black" }}
          onClick={onOpenModal}
          className="flex items-center"
          title="New Note"
        >
          <PlusOutlined />
          <span className="hidden md:inline">New Note</span>
        </Button>
      </div>
    </div>
  );
}
