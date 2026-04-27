import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { api } from "@/utils/api";
import { Note } from "@/types";
import { supabase } from "@/utils/supabase/client";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

    const fetchNotes = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("fetch-note");
      if (res.status !== 200) {
        throw new Error("Failed to Fetch");
      }
      setNotes(res.data);
    } catch (e) {
      message.error("Failed to fetch");
    }
    setLoading(false);
  }, []);

  //realtime
  useEffect(() => {
    const channel = supabase
      .channel("public:notes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) => {
          fetchNotes();
        },
      )
      .subscribe();

    const shareChannel = supabase
      .channel("public:note_shares")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "note_shares" },
        (payload) => {
          fetchNotes();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(shareChannel);
    };
  }, [fetchNotes]);

  const createNote = async (
    title: string,
    content: string,
    onSuccess?: () => void,
  ) => {
    try {
      const res = await api.post("create-note", { title, content });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      message.success("Note created");
      await fetchNotes();
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error("Failed to create note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await api.post("delete-note", { id });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      message.success("Note deleted");
    } catch (error) {
      message.error("Failed to delete note");
    }
  };

  const editNote = async (id: string, title: string, content: string) => {
    try {
      const res = await api.post("edit-note", { id, title, content });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      message.success("Note Updated");
    } catch (error) {
      message.error("Failed to Update note");
    }
  };

  return { notes, loading, fetchNotes, createNote, deleteNote, editNote };
};
