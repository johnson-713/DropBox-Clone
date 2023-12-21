"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppStore } from "../../store/store"
import { useUser } from "@clerk/nextjs"
import { deleteObject, getDownloadURL, ref } from "firebase/storage"
import { db, storage } from "../../firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { getMetadata } from "firebase/storage";


export function DeleteModal() {
    const { user } = useUser()
    const [ 
        setFileId,
        setIsDeleteModalOpen,
        isDeleteModalOpen,
        fileId,
        ] = useAppStore(state => [ 
        state.setFileId,
        state.setIsDeleteModalOpen,
        state.isDeleteModalOpen,
        state.fileId,
    ])


    async function deleteFile() {
      if (!user || !fileId) return;
      const fileRef = ref(storage, `users/${user.id}/files/${fileId}`)

      // await deleteObject(fileRef).then(() => {
      //   deleteDoc(doc(db, "users", user.id, "files", fileId)).then(() => {
      //     console.log("Deleted")
      //   })
      // })


      try {
        // Check if the file exists by attempting to get metadata
        await getMetadata(fileRef);
    
        // File exists, proceed with deletion
        await deleteObject(fileRef);
        await deleteDoc(doc(db, "users", user.id, "files", fileId));
        console.log("Deleted");
      } catch (error) {
        console.error("Error deleting file:", error);
        // Check if the error is specifically a "not found" error
        if (error.code === 'storage/object-not-found') {
          console.log("File does not exist");
        } else {
          console.log("Unexpected error:", error);
        }
      } finally {
        setIsDeleteModalOpen(false);
      }
    }
  return (
    <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
            setIsDeleteModalOpen(isOpen)
        }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure want to delete?</DialogTitle>
          <DialogDescription>
            This action can not be undone. This will permanently delete your file!
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
            <Button
                size="sm"
                className="px-3 flex-1"
                variant={"outline"}
                onClick={() => setIsDeleteModalOpen(false)}
            >
                <span className="sr-only">Cancel</span>
                <span>Cancel</span>
            </Button>

            <Button
                type="submit"
                size="sm"
                variant={"ghost"}
                className="px-3 flex-1"
                onClick={() => deleteFile()}
            >
                <span className="sr-only">Delete</span>
                <span>Delete</span>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

