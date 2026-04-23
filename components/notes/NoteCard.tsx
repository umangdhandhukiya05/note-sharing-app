import { Button, Card, Col } from "antd";
import { Note } from "@/types";
import { ShareAltOutlined } from "@ant-design/icons";
import { useState } from "react";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <>
      <Card hoverable>
        <h3 className="text-lg">{note.title?.slice(0, 32)}...</h3>

        <p className="text-gray-400 font-semibold mt-2">
          {note.content?.slice(0, 120) || "No content"}
        </p>
      </Card>
    </>
  );
}
