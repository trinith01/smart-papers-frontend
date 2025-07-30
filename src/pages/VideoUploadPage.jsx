"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Video,
  User,
  BookOpen,
  Lock,
  Play,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

export default function VideoUploadPage() {
  const [uploadedVideos, setUploadedVideos] = useState([
    // {
    //   id: "1",
    //   author: "Dr. Smith",
    //   videoLink: "https://www.youtube.com/watch?v=v5sgjMQA1Hs&t=1526s",
    //   unitName: "Introduction to Physics",
    //   private: false,
    //   thumbnail: "https://img.youtube.com/vi/v5sgjMQA1Hs/maxresdefault.jpg",
    //   title: "Basic Physics Concepts",
    //   videoId: "v5sgjMQA1Hs",
    // },
    // {
    //   id: "2",
    //   author: "Prof. Johnson",
    //   videoLink: "https://www.youtube.com/watch?v=MWbxmox-Mek",
    //   unitName: "Advanced Mathematics",
    //   private: true,
    //   thumbnail: "https://img.youtube.com/vi/MWbxmox-Mek/maxresdefault.jpg",
    //   title: "Calculus Fundamentals",
    //   videoId: "MWbxmox-Mek",
    // },
    // {
    //   id: "3",
    //   author: "Dr. Wilson",
    //   videoLink: "https://www.youtube.com/watch?v=drnsBOB2Gr0",
    //   unitName: "Introduction to Physics",
    //   private: false,
    //   thumbnail: "https://img.youtube.com/vi/drnsBOB2Gr0/maxresdefault.jpg",
    //   title: "Newton's Laws Explained",
    //   videoId: "drnsBOB2Gr0",
    // },
    // {
    //   id: "4",
    //   author: "Dr. Brown",
    //   videoLink: "https://www.youtube.com/watch?v=abc123def456",
    //   unitName: "Chemistry Basics",
    //   private: false,
    //   thumbnail: "https://img.youtube.com/vi/abc123def456/maxresdefault.jpg",
    //   title: "Chemical Reactions",
    //   videoId: "abc123def456",
    // },
  ]);
  useEffect(() =>{
    const fetchVideos = async () => {
      const response = await api.get("/api/videos");
      console.log(response.data);
      setUploadedVideos(response.data);

    }
  fetchVideos()

  } , [])
  const [formData, setFormData] = useState({
    //author: "",
    videoLink: "",
    unitName: "",
    private: false,
    name: "",
  });

  

  // Extract YouTube video ID from URL
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  // Generate YouTube thumbnail URL
  const getThumbnailUrl = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
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
        setFormData({
          name: "",
          videoLink: "",
          unitName: "",
          private: false,
        });
      } else {
        toast.error(res.data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  } else {
    toast.error("Invalid YouTube link");
  }
};


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteVideo = (id) => {
    setUploadedVideos((prev) => prev.filter((video) => video.id !== id));
  };

  // Group videos by unit name
  const groupedVideos = uploadedVideos.reduce((acc, video) => {
    if (!acc[video.unitName]) {
      acc[video.unitName] = [];
    }
    acc[video.unitName].push(video);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form - First Row (Horizontal) */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Upload New Video
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Add YouTube video links to your course library
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Fields in Horizontal Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Author Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="author"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    name
                  </Label>
                  <Input
                    id="author"
                    type="text"
                    placeholder="Enter video title name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Unit Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="unitName"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Unit Name
                  </Label>
                  <Select
                    value={formData.unitName}
                    onValueChange={(value) =>
                      handleInputChange("unitName", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unit 1">Unit 1</SelectItem>
                      <SelectItem value="Unit 2">Unit 2</SelectItem>
                      <SelectItem value="Unit 3">Unit 3</SelectItem>
                      <SelectItem value="Unit 4">Unit 4</SelectItem>
                      <SelectItem value="Unit 5">Unit 5</SelectItem>
                      <SelectItem value="Unit 6">Unit 6</SelectItem>
                      <SelectItem value="Unit 7">Unit 7</SelectItem>
                      <SelectItem value="Unit 8">Unit 8</SelectItem>
                      <SelectItem value="Unit 9">Unit 9</SelectItem>
                      <SelectItem value="Unit 10">Unit 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Video Link Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="videoLink"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4 text-purple-600" />
                    YouTube Link
                  </Label>
                  <Input
                    id="videoLink"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoLink}
                    onChange={(e) =>
                      handleInputChange("videoLink", e.target.value)
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* Private Toggle and Submit Button */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    Privacy & Action
                  </Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Private</span>
                      <Switch
                        id="private"
                        checked={formData.private}
                        onCheckedChange={(checked) =>
                          handleInputChange("private", checked)
                        }
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm font-medium"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Video Library - Categorized by Unit */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Video Library
              </h2>
              <p className="text-gray-600 mt-1">
                Your uploaded videos organized by units
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {uploadedVideos.length} total video
              {uploadedVideos.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {Object.keys(groupedVideos).length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No videos uploaded yet
                </h3>
                <p className="text-gray-500">
                  Start by uploading your first video using the form above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedVideos).map(([unitName, videos]) => (
                <div key={unitName} className="space-y-4">
                  {/* Unit Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {unitName}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      {videos.length} video{videos.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Videos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map((video) => (
                      <Card
                        key={video._id}
                        className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:scale-105"
                      >
                        <div className="relative">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => {
                              const target = e.target;
                              target.src =
                                "/placeholder.svg?height=192&width=320&text=Video+Thumbnail";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                            <Button
                              size="sm"
                              className="bg-white/95 text-gray-900 hover:bg-white shadow-lg"
                              onClick={() =>
                                window.open(video.videoLink, "_blank")
                              }
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Watch Now
                            </Button>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2">
                            {video.private ? (
                              <Badge
                                variant="secondary"
                                className="bg-red-100 text-red-700 text-xs shadow-sm"
                              >
                                <EyeOff className="w-3 h-3 mr-1" />
                                Private
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs shadow-sm"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Public
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-3 left-3 text-red-500 hover:text-red-700 hover:bg-red-50/90 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => deleteVideo(video._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                            <User className="w-3 h-3" />
                            <span className="truncate">{video.author.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent text-xs"
                            onClick={() =>
                              window.open(video.videoLink, "_blank")
                            }
                          >
                            <Play className="w-3 h-3 mr-2" />
                            Watch Video
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
