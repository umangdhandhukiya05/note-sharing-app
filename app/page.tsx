"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useNotes } from "@/hooks/useNotes";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { NoteCard } from "@/components/notes/NoteCard";
import { CreateNoteModal } from "@/components/notes/CreateNoteModal";
import Link from "next/link";
import { Empty } from "antd";
import type { User as AuthUser } from "@supabase/supabase-js";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentUser, setcurrentUser] = useState<AuthUser | null>(null);

  const router = useRouter();
  const { notes, fetchNotes, createNote } = useNotes();

  const myNotes = notes.filter((note) => note.owner_id === currentUser?.id);
  const shareWithMe = notes.filter((note) => note.owner_id !== currentUser?.id);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }
    setcurrentUser(data.user);
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
    <div>
      <DashboardHeader onOpenModal={openModal} />

      <div className="px-6 pt-3">
        <div>
          <div className="flex gap-2 items-center mb-3">
            <div className="h-7 w-7 bg-black rounded-tr-full rounded-br-full"></div>
            <h1 className="text-xl">My Notes</h1>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3">
            {myNotes.length > 0 ? (
              myNotes.map((note) => (
                <Link key={note.id} href={`/note/${note.id}`}>
                  <NoteCard note={note} />
                </Link>
              ))
            ) : (
              <div className="col-span-full pt-6 pb-4">
                <Empty description="No notes" />
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex gap-2 items-center mb-3">
            <div className="h-7 w-7 bg-black rounded-tr-full rounded-br-full"></div>
            <h1 className="text-xl">Collobrative Notes</h1>
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            {shareWithMe.length > 0 ? (
              shareWithMe.map((note) => (
                <Link key={note.id} href={`/note/${note.id}`}>
                  <NoteCard note={note} />
                </Link>
              ))
            ) : (
              <div className="col-span-full pt-6 pb-4">
                <Empty description="No notes" />
              </div>
            )}
          </div>
        </div>
      </div>

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
