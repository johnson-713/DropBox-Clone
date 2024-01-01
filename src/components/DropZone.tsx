"use client"

import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { db, storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { error } from 'console';
import { FileType } from '../../typings';


function DropZoneComponent() {
    const [loading, setLoading] = useState(false)
    const { isLoaded, isSignedIn, user} = useUser()

    const onDrop = (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()

        reader.onabort = () => console.log("file reading was aborted")
        reader.onerror = () => console.log("file reading has failed")
        reader.onload = async () => {
          await uploadPost(file)
        }
        reader.readAsArrayBuffer(file)
      })
    }

    const uploadPost = async (selectedFile: File) => {
        if(loading) return;
        if(!user) return;

        setLoading(true);

        //addDoc => users/user12345/files
        const docRef = await addDoc(collection(db, "users", user.id, "files"), {
          userId: user.id,
          filename: selectedFile.name,
          fullName: user.fullName,
          profileImg: user.imageUrl,
          timestamp: serverTimestamp(),
          type: selectedFile.type,
          size: selectedFile.size,
        })

        const imageRef = ref(storage, `users${user.id}/files/${docRef.id}`)

        uploadBytes(imageRef, selectedFile).then(async () => {
          const downloadURL = await getDownloadURL(imageRef)

          await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
            downloadURL: downloadURL,
          })
        })

        async function convertHtmlToPdf(htmlFile: File, user: { id: string }, docRef: { id: string }): Promise<void> {
          return new Promise(async (resolve, reject) => {
            const reader = new FileReader();
        
            reader.onload = async (event) => {
              const htmlContent = event.target?.result as string;
        
              const pdf = new jsPDF();
        
              // Use html2canvas to capture the HTML content
              const canvas = await html2canvas(document.body);
        
              // Convert the canvas to an image data URL
              const imgData = canvas.toDataURL('image/png');
        
              // Add the image data to the PDF
              pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

              const pdfBlob = pdf.output('blob');
        
              // Upload the PDF to Firebase Storage
              const pdfStorageRef = ref(storage, `users/${user.id}/files/${docRef.id}.pdf`);
              await uploadBytes(pdfStorageRef, pdfBlob);
        
              // Get the download URL of the uploaded PDF
              const pdfDownloadURL = await getDownloadURL(pdfStorageRef);
        
              // Update Firestore document with the PDF download URL
              await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
                downloadURL: pdfDownloadURL,
              })
        
              // Resolve the promise
              resolve();
            };
        
            // Read the HTML file content
            reader.readAsText(htmlFile);
          });
        }

        // const fileType = selectedFile.type;

        // if(fileType === 'text/html') {
        //   uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
        //     const pdfBlob = await convertHtmlToPdf(selectedFile)

        //     const pdfRef = ref(storage, `users/${user.id}/files/${docRef.id}.pdf`)
        //     await uploadBytes(pdfRef, pdfBlob)

        //     const pdfDownloadURL = await getDownloadURL(pdfRef)

        //     await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
        //       downloadURL: pdfDownloadURL,
        //     })

        //   })
        // }
    }

    const maxSize = 20971520;
  return (
    <Dropzone minSize={0} maxSize={maxSize} onDrop={onDrop}>
  {({
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections}) => {
      const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

      return (
        <section className='m-4'>
      <div 
        {...getRootProps()}
        className={cn(
            "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-xl text-center",
            isDragActive ? "bg-[#035FFE] text-white animate-pulse" : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
        )}>
        <input {...getInputProps()} />
        {!isDragActive && "Click here or drop a file to upload!"}
        {isDragActive && !isDragReject && "Drop to upload this file!"}
        {isDragReject && "File type not accepted, sorry!"}
        {
            isFileTooLarge && (
                <div className="text-danger mt-2">File is too large.</div>
            )
        }
      </div>
    </section>
      )
    }}
</Dropzone>
  )
}

export default DropZoneComponent;
