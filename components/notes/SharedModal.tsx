import { message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";

type User = {
  id: string;
  email: string;
  display_name: string;
};

type SharedModalProps = {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  noteId: string;
  currentUser: { id: string } | null;
};

export function SharedModal({
  open,
  onCancel,
  onSuccess,
  noteId,
  currentUser,
}: SharedModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [permission, setPermission] = useState("view");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    const res = await api.get("get-allUser");
    setUsers(res.data);
  };

  const handleShare = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await api.post("share-note", {
        note_id: noteId,
        user_id: selectedUser,
        permission,
      });

      if (onSuccess) {
        message.success("Note shared to user");
        onSuccess();
      }
      onCancel();
    } catch (error) {
      message.error("Failed to share note");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUser = currentUser
    ? users.filter((user) => user.id !== currentUser.id)
    : users;

  return (
    <Modal
      open={open}
      onOk={handleShare}
      onCancel={onCancel}
      title="Share Note"
      confirmLoading={isLoading}
      cancelButtonProps={{
        style: { background: "black", borderColor: "black", color: "white" },
        disabled: isLoading,
      }}
      okButtonProps={{
        style: { background: isLoading ? "#d9d9d9" : "black", borderColor: isLoading ? "#d9d9d9" : "black", color: "white" },
      }}
    >
      <Select
        showSearch
        placeholder="Select user"
        style={{ width: "100%" }}
        value={selectedUser}
        onChange={setSelectedUser}
        disabled={isLoading}
        options={filteredUser.map((user) => ({
          label: `${user.display_name || "No Name"} (${user.email})`,
          value: user.id,
        }))}
      />

      <Select
        value={permission}
        onChange={setPermission}
        style={{ width: "100%", marginTop: 10 }}
        disabled={isLoading}
        options={[
          { label: "View", value: "view" },
          { label: "Edit", value: "edit" },
        ]}
      />
    </Modal>
  );
}
