'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { HiOutlinePhotograph } from 'react-icons/hi';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '@/firebase';
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

export default function () {
  const { data: session } = useSession();
  const imagePicRef = useRef(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [text, setText] = useState('');
  const [postLoading, setPostLoading] = useState(false);

  const db = getFirestore(app);

  function addImageToPost(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  function uploadImageToStorage() {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL), setImageFileUploading(false);
        });
      },
    );
  }

  const handleSubmit = async () => {
    setPostLoading(true);
    const docRef = await addDoc(collection(db, 'posts'), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text: text,
      image: imageFileUrl,
      timestamp: serverTimestamp(),
    });
    setPostLoading(false);
    setText('');
    setImageFileUrl(null), setSelectedFile(null);
    location.reload();
  };

  if (!session) return null;
  return (
    <div className='flex border-b border-gray-200 p-3 space-x-3 w-full'>
      <img
        src={session.user.image}
        alt='user-image'
        className='h-11 w-11 rounded-full cursor-pointer hover:brightness-95'
      />
      <div className='w-full divide-y divide-gray-200'>
        <textarea
          rows={2}
          placeholder='Whats happening'
          className='w-full border-none outline-none tracking-wide min-h-[50px] text-gray-700'
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {selectedFile && (
          <img
            src={imageFileUrl}
            alt='image'
            className={`w-full max-h-[250px] object-cover cursor-pointer 
              ${imageFileUploading ? 'animate-pulse' : ''}
              `}
          />
        )}
        <div className='flex items-center justify-between pt-2.5'>
          <HiOutlinePhotograph
            className='h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer'
            onClick={() => imagePicRef.current.click()}
          />
          <input
            type='file'
            hidden
            accept='image/*'
            onChange={addImageToPost}
            ref={imagePicRef}
          />
          <button
            className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
            disabled={text.trim() === '' || postLoading || imageFileUploading}
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
