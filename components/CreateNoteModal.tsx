import { Modal, Input } from "antd";

interface CreateNoteModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onOk: () => void;
  onTitleChange: (value: string) => void;
}

export function CreateNoteModal({
  open,
  title,
  onCancel,
  onOk,
  onTitleChange,
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
    </Modal>
  );
}
