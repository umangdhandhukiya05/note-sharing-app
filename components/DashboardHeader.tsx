import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onOpenModal: () => void;
}

export function DashboardHeader({ onOpenModal }: DashboardHeaderProps) {
  const router = useRouter();

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
      }}
    >
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <Button onClick={handleLogout}>Logout</Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={onOpenModal}>
          New Note
        </Button>
      </div>
    </div>
  );
}
