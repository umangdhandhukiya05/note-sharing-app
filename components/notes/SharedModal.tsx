import { Button, Modal, Select } from "antd";
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
  noteId: string;
};

export function SharedModal({ open, onCancel, noteId }: SharedModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [permission, setPermission] = useState("view");
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchSharedUsers();
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

    onCancel();
  };

  const fetchSharedUsers = async () => {
    const res = await api.post("get-shared-user", { note_id: noteId });
    setSharedUsers(res.data);
  };

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
        options={users.map((user) => ({
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

      <div style={{ marginTop: 20 }}>
        {sharedUsers.map((share) => (
          <div
            key={share.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span>
              {share.user.display_name} ({share.user.email})
            </span>

            <div style={{ display: "flex", gap: 10 }}>
              <Select
                value={share.permission}
                onChange={(value) =>
                  api
                    .post("update-share", {
                      share_id: share.id,
                      permission: value,
                    })
                    .then(fetchSharedUsers)
                }
                options={[
                  { label: "View", value: "view" },
                  { label: "Edit", value: "edit" },
                ]}
                style={{ width: 100 }}
              />

              <Button
                danger
                onClick={() =>
                  api
                    .post("remove-share", {
                      share_id: share.id,
                    })
                    .then(fetchSharedUsers)
                }
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
