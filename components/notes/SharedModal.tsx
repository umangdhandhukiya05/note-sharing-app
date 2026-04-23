import { Modal, Select } from "antd";
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
  currentUser: User;
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

    await api.post("share-note", {
      note_id: noteId,
      user_id: selectedUser,
      permission,
    });

    if (onSuccess) {
      onSuccess();
    }
    onCancel();
  };

  const filteredUser = users.filter((user) => user.id !== currentUser.id);

  return (
    <Modal
      open={open}
      onOk={handleShare}
      onCancel={onCancel}
      title="Share Note"
    >
      <Select
        showSearch
        placeholder="Select user"
        style={{ width: "100%" }}
        value={selectedUser}
        onChange={setSelectedUser}
        options={filteredUser.map((user) => ({
          label: `${user.display_name || "No Name"} (${user.email})`,
          value: user.id,
        }))}
      />

      <Select
        value={permission}
        onChange={setPermission}
        style={{ width: "100%", marginTop: 10 }}
        options={[
          { label: "View", value: "view" },
          { label: "Edit", value: "edit" },
        ]}
      />
    </Modal>
  );
}
