import { useState, useCallback } from "react";
import { message } from "antd";
import { supabase } from "@/utils/supabase/client";
import { api } from "@/utils/api";

export type Note = {
  id: string;
  title: string;
  content: string;
  owner_id: string;
  is_public: boolean;
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      message.error(error.message);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  }, []);

  const createNote = async (title: string, onSuccess?: () => void) => {
    try {
      const res = await api.post("/functions/v1/create-note", { title });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      message.success("Created");
      await fetchNotes();
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error("Failed to create note");
    }
  };

  return { notes, loading, fetchNotes, createNote };
};
