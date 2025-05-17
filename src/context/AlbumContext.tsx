import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UploadedImage } from "../services/cloudinaryService";

// Define our album type
export interface Album {
  id: string;
  name: string;
  photographer: string;
  password: string;
  coverPhoto: UploadedImage;
  images: UploadedImage[];
  createdAt: string;
}

interface AlbumContextType {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  coverPhoto: UploadedImage | null;
  setCoverPhoto: React.Dispatch<React.SetStateAction<UploadedImage | null>>;
  currentStep: "upload" | "selectCover" | "albumDetails" | "viewAlbum" | "albumsList";
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"upload" | "selectCover" | "albumDetails" | "viewAlbum" | "albumsList">
  >;
  albums: Album[];
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
  addAlbum: (album: Album) => void;
  currentAlbum: Album | null;
  setCurrentAlbum: React.Dispatch<React.SetStateAction<Album | null>>;
  reset: () => void;
}

const AlbumContext = createContext<AlbumContextType | undefined>(undefined);

export const useAlbum = (): AlbumContextType => {
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error("useAlbum must be used within an AlbumProvider");
  }
  return context;
};

export const AlbumProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<UploadedImage | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "upload" | "selectCover" | "albumDetails" | "viewAlbum" | "albumsList"
  >("upload");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

  // Load albums from localStorage on initial render
  useEffect(() => {
    const savedAlbums = localStorage.getItem("albums");
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
    }
  }, []);

  // Save albums to localStorage whenever they change
  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem("albums", JSON.stringify(albums));
    }
  }, [albums]);

  const addAlbum = (album: Album) => {
    setAlbums((prevAlbums) => [...prevAlbums, album]);
  };

  const reset = () => {
    setUploadedImages([]);
    setCoverPhoto(null);
    setCurrentAlbum(null);
    setCurrentStep("upload");
  };

  const value = {
    uploadedImages,
    setUploadedImages,
    coverPhoto,
    setCoverPhoto,
    currentStep,
    setCurrentStep,
    albums,
    setAlbums,
    addAlbum,
    currentAlbum,
    setCurrentAlbum,
    reset,
  };

  return <AlbumContext.Provider value={value}>{children}</AlbumContext.Provider>;
};
