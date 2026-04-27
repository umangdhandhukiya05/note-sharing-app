import { Modal, Input } from "antd";
import { useState, useEffect } from "react";

interface EditModalProps {
  editOpen: boolean;
  initialTitle: string;
  initialContent: string;
  isLoading?: boolean;
  onCancel: () => void;
  onOk: (title: string, content: string) => void;
}

export function EditNoteModal({
  editOpen,
  initialTitle,
  initialContent,
  isLoading = false,
  onCancel,
  onOk,
}: EditModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (editOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [editOpen, initialTitle, initialContent]);

  return (
    <Modal
      title="Update Note"
      open={editOpen}
      onCancel={onCancel}
      onOk={() => onOk(title, content)}
      okText="Update"
      confirmLoading={isLoading}
      cancelButtonProps={{
        style: { background: "black", borderColor: "black", color: "white" },
        disabled: isLoading,
      }}
      okButtonProps={{
        style: { background: isLoading ? "#d9d9d9" : "black", borderColor: isLoading ? "#d9d9d9" : "black", color: "white" },
      }}
    >
      <Input
        placeholder="Enter note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input.TextArea
        rows={10}
        style={{ marginTop: "8px", resize: "none" }}
        placeholder="Enter note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </Modal>
  );
}
