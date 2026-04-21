import { Button, Card, Col } from "antd";
import { Note } from "@/hooks/useNotes";
import { EditOutlined } from "@ant-design/icons";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Col xs={24} sm={12} md={8} >
      <Card hoverable className="flex justify-between w-full">
        <h3>{note.title}</h3>

        <p style={{ color: "#666" }}>
          {note.content?.slice(0, 80) || "No content"}
        </p>
      </Card>
    </Col>
  );
}
