
import React, { useState } from "react";
import { useAlbum, Album } from "../context/AlbumContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Album as AlbumIcon, Lock, Plus, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AlbumsList: React.FC = () => {
  const { albums, setCurrentAlbum, setCurrentStep, reset } = useAlbum();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [password, setPassword] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleCreateNewAlbum = () => {
    reset();
    setCurrentStep("upload");
  };

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setPasswordDialogOpen(true);
    setPassword("");
    setPasswordError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAlbum && password === selectedAlbum.password) {
      setCurrentAlbum(selectedAlbum);
      setCurrentStep("viewAlbum");
      setPasswordDialogOpen(false);
      toast.success("Album unlocked successfully!");
    } else {
      setPasswordError(true);
      toast.error("Incorrect password!");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-2">Your Albums</h2>
        <p className="text-center text-gray-600 mb-8">
          Browse and view your saved photo albums
        </p>

        {albums.length === 0 ? (
          <div className="text-center py-12">
            <AlbumIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No Albums Yet</h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first photo album
            </p>
            <Button
              onClick={handleCreateNewAlbum}
              className="bg-purple hover:bg-purple-dark text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Album
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={album.coverPhoto.secure_url}
                        alt={album.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        Protected
                      </div>
                    </div>
                    <CardHeader className="py-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlbumIcon className="h-5 w-5 text-purple" />
                        {album.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 text-sm space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {album.photographer}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(album.createdAt), "MMM d, yyyy")}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 pb-4 mt-auto">
                      <Button
                        onClick={() => handleSelectAlbum(album)}
                        className="w-full"
                        variant="outline"
                      >
                        View Album
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleCreateNewAlbum}
                className="bg-purple hover:bg-purple-dark text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Album
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> 
              Password Protected Album
            </DialogTitle>
            <DialogDescription>
              Enter the password to view "{selectedAlbum?.name}"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Input
                type="password" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-sm text-red-500">Incorrect password</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Unlock</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlbumsList;
