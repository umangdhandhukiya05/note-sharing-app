import { useState, useCallback } from "react";
import { message } from "antd";
import { api } from "@/utils/api";
import { Note } from "@/types";

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
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch note");
    }
    setLoading(false);
  }, []);

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
      message.success("Created");
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
      message.success("delete successfully");
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
      message.success("Updated");
    } catch (error) {
      message.error("Failed to Update note");
    }
  };

  return { notes, loading, fetchNotes, createNote, deleteNote, editNote };
};
