"use client";

import { useEffect, useState } from "react";
import { Row } from "antd";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useNotes } from "@/hooks/useNotes";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { NoteCard } from "@/components/notes/NoteCard";
import { CreateNoteModal } from "@/components/notes/CreateNoteModal";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();
  const { notes, fetchNotes, createNote } = useNotes();

  // check user + fetch notes
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    fetchNotes();
  };

  const openModal = () => {
    setTitle("");
    setContent("");
    setOpen(true);
  };

  const handleCreateNote = () => {
    createNote(title, content, () => setOpen(false));
  };

  return (
    <div style={{ padding: 30 }}>
      <DashboardHeader onOpenModal={openModal} />

      <Row gutter={[16, 16]}>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </Row>

      <CreateNoteModal
        open={open}
        title={title}
        content={content}
        onCancel={() => setOpen(false)}
        onOk={handleCreateNote}
        onContentChange={setContent}
        onTitleChange={setTitle}
      />
    </div>
  );
}
