import { Button, Card, Col } from "antd";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types";
import {
  DeleteTwoTone,
  EditOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { EditNoteModal } from "./EditNoteModal";
import { SharedModal } from "./SharedModal";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote, editNote } = useNotes();

  const [editOpen, setEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isShare, setIsShare] = useState(false);

  const handleEditNote = async () => {
    await editNote(note.id, newTitle, newContent);
    setEditOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const handleOpen = () => {
    setEditOpen(true);
    setNewTitle(note.title);
    setNewContent(note.content);
  };

  return (
    <>
      {editOpen && (
        <EditNoteModal
          editOpen={editOpen}
          NewTitle={newTitle}
          NewContent={newContent}
          onTitleChange={setNewTitle}
          onContentChange={setNewContent}
          onOk={handleEditNote}
          onCancel={() => setEditOpen(false)}
        />
      )}

      {isShare && (
        <SharedModal
          open={isShare}
          onCancel={() => setIsShare(false)}
          noteId={note.id}
        />
      )}

      <Col xs={24} sm={12} md={6}>
        <Card hoverable>
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg">{note.title?.slice(0, 14)}...</h3>

            <div className="flex gap-2">
              <Button
                onClick={handleOpen}
                style={{ border: "1px solid black" }}
                color="default"
                icon={
                  <EditOutlined
                    twoToneColor={"black"}
                    style={{ fontSize: "20px" }}
                  />
                }
              ></Button>
              <Button
                onClick={() => handleDeleteNote(note.id)}
                style={{ border: "1px solid red" }}
                icon={
                  <DeleteTwoTone
                    twoToneColor={"red"}
                    style={{ fontSize: "20px" }}
                  />
                }
              ></Button>
              <Button
                onClick={() => setIsShare(true)}
                style={{ border: "1px solid black" }}
                icon={
                  <ShareAltOutlined
                    style={{ fontSize: "20px", color: "black" }}
                  />
                }
              ></Button>
            </div>
          </div>
          <p className="text-gray-400 font-semibold mt-2">
            {note.content?.slice(0, 80) || "No content"}
          </p>
        </Card>
      </Col>
    </>
  );
}
