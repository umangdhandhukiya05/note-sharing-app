"use client";

import { Tag, Button, Card, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useDetails } from "@/hooks/useDetails";
import { EditNoteModal } from "@/components/notes/EditNoteModal";
import { SharedModal } from "@/components/notes/SharedModal";

const NoteDetail = () => {
  const params = useParams();
  const id = params.id as string;

  const {
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
  } = useDetails(id);

  // Subscribe to realtime changes for this note and its shares
  useEffect(() => {
    if (!id) return;
    const noteChannel = supabase.channel(`public:notes:${id}:page`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `id=eq.${id}` }, () => {
        // No-op: useDetails already subscribes and refetches, but this ensures UI stays in sync if used directly
      })
      .subscribe();
    const shareChannel = supabase.channel(`public:note_shares:${id}:page`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'note_shares', filter: `note_id=eq.${id}` }, () => {
        // No-op: useDetails already subscribes and refetches
      })
      .subscribe();
    return () => {
      supabase.removeChannel(noteChannel);
      supabase.removeChannel(shareChannel);
    };
  }, [id]);

  return (
    <>
      {editOpen && (
        <EditNoteModal
          editOpen={editOpen}
          initialTitle={note?.title || ""}
          initialContent={note?.content || ""}
          onOk={handleEditNote}
          onCancel={() => setEditOpen(false)}
        />
      )}

      {isShare && (
        <SharedModal
          open={isShare}
          onCancel={() => setIsShare(false)}
          onSuccess={() => fetchSharedUsers()}
          noteId={id}
          currentUser={currentUser}
        />
      )}

      <div className="h-screen flex flex-col bg-gray-100">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-white border-b">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {note?.title}
            </h1>

            <Tag color={note?.is_public ? "green" : "default"}>
              {note?.is_public ? "Public" : "Private"}
            </Tag>
          </div>

          <Button onClick={() => router.back()}>Back</Button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <div className="w-full md:w-[70%] p-4 md:p-8 overflow-y-auto">
            <Card className="rounded-xl shadow-sm">
              <p className="text-base md:text-lg leading-7 md:leading-8 text-gray-700 whitespace-pre-line">
                {note?.content}
              </p>
            </Card>
          </div>

          <div className="w-full flex flex-col gap-10 md:w-[30%] p-4 md:p-8 bg-white border-t md:border-t-0 md:border-l overflow-y-auto">
            <Card
              title="Shared With"
              extra={
                <Button
                  style={{ backgroundColor: "black", color: "white" }}
                  shape="circle"
                  icon={<ShareAltOutlined />}
                  onClick={() => setIsShare(true)}
                />
              }
            >
              {sharedUsers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  Not shared with anyone
                </p>
              ) : (
                <div className="flex flex-col gap-4 ">
                  {sharedUsers.map((share) => (
                    <div
                      key={share.id}
                      className="flex justify-between items-center gap-2"
                    >
                      <div className="text-sm font-medium text-gray-800 flex flex-col">
                        <h1>{share.user.display_name}</h1>
                        <h1>{share.user.email}</h1>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <Select
                          value={share.permission}
                          onChange={(value) => updateShare(share.id, value)}
                          options={[
                            { label: "View", value: "view" },
                            { label: "Edit", value: "edit" },
                          ]}
                          className="w-24"
                          size="small"
                        />

                        <Button
                          danger
                          size="small"
                          onClick={() => removeShare(share.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            <Card title="Version History">
              {versions?.map((v: any) => (
                <div
                  className="flex justify-between items-center my-1"
                  key={v.id}
                >
                  <p>{new Date(v.created_at).toLocaleString()}</p>
                  <Button
                    style={{ backgroundColor: "black", color: "white" }}
                    onClick={() => restore(v.id)}
                  >
                    Restore
                  </Button>
                </div>
              ))}
            </Card>
          </div>
        </div>

        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <Button
            style={{ backgroundColor: "black", color: "white" }}
            shape="circle"
            size="large"
            icon={<EditOutlined />}
            onClick={handleOpenEditModal}
          />

          <Button
            danger
            shape="circle"
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteNote()}
          />
        </div>
      </div>
    </>
  );
};

export default NoteDetail;
