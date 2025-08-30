"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import VideoUploading from "@/components/video-upload-page/VideoUploading";
import UploadedVideos from "@/components/video-upload-page/UploadedVideos";

export default function VideoUploadPage() {
  const [uploadedVideos, setUploadedVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const response = await api.get(`/api/videos/author/${JSON.parse(localStorage.getItem("userData"))._id}`);
      setUploadedVideos(response.data);
    };
    fetchVideos();
  }, []);

  // Extract YouTube video ID from URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  // Generate YouTube thumbnail URL
  const getThumbnailUrl = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleUpload = async (formData, resetForm) => {
    const videoId = extractVideoId(formData.videoLink);
    if (videoId) {
      const newVideo = {
        ...formData,
        thumbnail: getThumbnailUrl(videoId),
        author: JSON.parse(localStorage.getItem("userData"))._id,
        videoId,
      };
      try {
        const res = await api.post("/api/videos", newVideo);
        if (res.data.success) {
          toast.success(res.data.message || "Video uploaded successfully!");
          setUploadedVideos((prev) => [...prev, newVideo]);
          resetForm({ name: "", videoLink: "", unitName: "", private: false });
        } else {
          toast.error(res.data.message || "Upload failed");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    } else {
      toast.error("Invalid YouTube link");
    }
  };

  const deleteVideo = (id) => {
    setUploadedVideos((prev) => prev.filter((video) => video._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VideoUploading onUpload={handleUpload} />
        <UploadedVideos uploadedVideos={uploadedVideos} deleteVideo={deleteVideo} />
      </main>
    </div>
  );
}

