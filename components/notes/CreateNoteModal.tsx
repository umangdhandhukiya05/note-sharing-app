import { Modal, Input } from "antd";

interface CreateNoteModalProps {
  open: boolean;
  title: string;
  content: string;
  onCancel: () => void;
  onOk: () => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export function CreateNoteModal({
  open,
  title,
  content,
  onCancel,
  onOk,
  onTitleChange,
  onContentChange,
}: CreateNoteModalProps) {
  return (
    <Modal
      title="Create Note"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText="Create"
    >
      <Input
        placeholder="Enter note title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <Input
        style={{ marginTop: "8px" }}
        placeholder="Enter note content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </Modal>
  );
}
