import { Note } from "@/types";
import type { Tables } from "@/types/supabase";
import { api } from "@/utils/api";
import { message } from "antd";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

type NoteVersion = Tables<"note_versions">;

type SharedUser = Tables<"note_shares"> & {
  user: Pick<Tables<"profiles">, "id" | "email" | "display_name">;
};

export const useDetails = (id: string) => {
  const router = useRouter();
  const { deleteNote, editNote } = useNotes();

  const [note, setNote] = useState<Note>();
  const [editOpen, setEditOpen] = useState(false);

  const [isShare, setIsShare] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [versions, setVersions] = useState<NoteVersion[]>([]);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/login");
      return;
    }
    setCurrentUser(data.user);
  };

  const fetchVersion = async () => {
    try {
      const res = await api.get<NoteVersion[]>(`fetch_versions?note_id=${id}`);
      setVersions(res.data);
    } catch (error) {
      console.error(error);
      message.error("Error while versions");
    }
  };

  const restore = async (version_id: string) => {
    try {
      await api.post("restor-version", { version_id: version_id });
      fetchSingleNote(id);
      fetchVersion();
      message.success("Version restored successfully");
    } catch (error) {
      message.error("Failed to restore version");
    }
  };

  const fetchSingleNote = async (noteId: string) => {
    try {
      const res = await api.get<Note>(`fetch-single-note?id=${noteId}`);

      if (res.status !== 200) {
        throw new Error("Failed");
      }
      setNote(res.data);
    } catch (error) {
      message.error("Failed to fetch");
    }
  };

  const fetchSharedUsers = async () => {
    try {
      const res = await api.post<SharedUser[]>("get-shared-user", {
        note_id: id,
      });
      setSharedUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Setup realtime subscriptions for note and note_shares
  useEffect(() => {
    if (id) {
      checkUser();
      fetchSingleNote(id);
      fetchSharedUsers();
      fetchVersion();

      const noteChannel = supabase
        .channel(`public:notes:${id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notes",
            filter: `id=eq.${id}`,
          },
          (payload) => {
            fetchSingleNote(id);
            fetchVersion();
          },
        )
        .subscribe();

      const shareChannel = supabase
        .channel(`public:note_shares:${id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "note_shares",
            filter: `note_id=eq.${id}`,
          },
          (payload) => {
            fetchSharedUsers();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(noteChannel);
        supabase.removeChannel(shareChannel);
      };
    }
  }, [id]);

  const handleDeleteNote = () => {
    deleteNote(id);
    router.replace("/");
  };

  const handleEditNote = async (
    updatedTitle: string,
    updatedContent: string,
  ) => {
    await editNote(id, updatedTitle, updatedContent);
    fetchSingleNote(id);
    fetchVersion();
    setEditOpen(false);
  };

  const handleOpenEditModal = () => {
    setEditOpen(true);
  };

  const updateShare = async (share_id: string, permission: string) => {
    try {
      await api.post("update-share", { share_id, permission });
    } catch (error) {
      message.error("Failed to update");
    }
    message.success("Permission updated");
    fetchSharedUsers();
  };

  const removeShare = async (share_id: string) => {
    try {
      await api.post("remove-share", { share_id });
    } catch (error) {
      message.error("Failed to remove");
    }
    message.success("Remove user access from note");
    fetchSharedUsers();
  };

  return {
    router,
    note,
    editOpen,
    setEditOpen,
    isShare,
    setIsShare,
    sharedUsers,
    currentUser,
    versions,
    handleDeleteNote,
    handleEditNote,
    handleOpenEditModal,
    updateShare,
    removeShare,
    restore,
    fetchSharedUsers,
  };
};
