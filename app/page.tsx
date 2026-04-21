"use client";

import { useEffect, useState } from "react";
import { Row } from "antd";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useNotes } from "@/hooks/useNotes";
import { DashboardHeader } from "@/components/DashboardHeader";
import { NoteCard } from "@/components/NoteCard";
import { CreateNoteModal } from "@/components/CreateNoteModal";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

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
    setOpen(true);
  };

  const handleCreateNote = () => {
    createNote(title, () => setOpen(false));
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
        onCancel={() => setOpen(false)}
        onOk={handleCreateNote}
        onTitleChange={setTitle}
      />
    </div>
  );
}
