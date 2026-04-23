import { Note } from "@/types";
import { api } from "@/utils/api";
import { message } from "antd";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { supabase } from "@/utils/supabase/client";

export const useDetails = (id: string) => {
  const router = useRouter();
  const { deleteNote, editNote } = useNotes();

  const [note, setNote] = useState<Note>();
  const [editOpen, setEditOpen] = useState(false);

  const [isShare, setIsShare] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<any[]>([]);

  const [currentUser, setCurrentUser] = useState<any>();
  const [versions, setVersions] = useState<any[]>();

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
      const res = await api.get(`fetch_versions?note_id=${id}`);
      setVersions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const restore = async (version_id: any) => {
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
      const res = await api.get(`fetch-single-note?id=${noteId}`);

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
      const res = await api.post("get-shared-user", { note_id: id });
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

      // Subscribe to changes for this note
      const noteChannel = supabase.channel(`public:notes:${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `id=eq.${id}` }, (payload) => {
          fetchSingleNote(id);
          fetchVersion();
        })
        .subscribe();

      // Subscribe to changes for shares of this note
      const shareChannel = supabase.channel(`public:note_shares:${id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'note_shares', filter: `note_id=eq.${id}` }, (payload) => {
          fetchSharedUsers();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(noteChannel);
        supabase.removeChannel(shareChannel);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeleteNote = () => {
    deleteNote(id);
    router.push("/");
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
    await api.post("update-share", { share_id, permission });
    fetchSharedUsers();
  };

  const removeShare = async (share_id: string) => {
    await api.post("remove-share", { share_id });
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
