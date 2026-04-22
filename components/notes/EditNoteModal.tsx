import { Modal, Input } from "antd";

interface EditModalProps {
  editOpen: boolean;
  NewTitle: string;
  NewContent: string;
  onCancel: () => void;
  onOk: (value: any) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export function EditNoteModal({
  editOpen,
  NewTitle,
  NewContent,
  onCancel,
  onOk,
  onTitleChange,
  onContentChange,
}: EditModalProps) {
  return (
    <Modal
      title="Update Note"
      open={editOpen}
      onCancel={onCancel}
      onOk={onOk}
      okText="Update"
    >
      <Input
        placeholder="Enter note title"
        value={NewTitle}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <Input
        style={{ marginTop: "8px" }}
        placeholder="Enter note content"
        value={NewContent}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </Modal>
  );
}
