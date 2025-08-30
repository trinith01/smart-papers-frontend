import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Eye, EyeOff, Play, Trash2, User, Video } from "lucide-react";

export default function UploadedVideos({ uploadedVideos, deleteVideo }) {
  // Group videos by unit name
  const groupedVideos = uploadedVideos.reduce((acc, video) => {
    if (!acc[video.unitName]) {
      acc[video.unitName] = [];
    }
    acc[video.unitName].push(video);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Library</h2>
          <p className="text-gray-600 mt-1">Your uploaded videos organized by units</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          {uploadedVideos.length} total video{uploadedVideos.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      {Object.keys(groupedVideos).length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-16">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No videos uploaded yet</h3>
            <p className="text-gray-500">Start by uploading your first video using the form above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedVideos).map(([unitName, videos]) => (
            <div key={unitName} className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">{unitName}</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {videos.length} video{videos.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <Card key={video._id} className="group hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:scale-105">
                    <div className="relative">
                      <img src={video.thumbnail || "/placeholder.svg"} alt={video.name} className="w-full h-48 object-cover rounded-t-lg" onError={(e) => { e.target.src = "/placeholder.svg?height=192&width=320&text=Video+Thumbnail"; }} />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <Button size="sm" className="bg-white/95 text-gray-900 hover:bg-white shadow-lg" onClick={() => window.open(video.videoLink, "_blank") }>
                          <Play className="w-4 h-4 mr-2" />
                          Watch Now
                        </Button>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2">
                        {video.private ? (
                          <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs shadow-sm">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs shadow-sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="absolute top-3 left-3 text-red-500 hover:text-red-700 hover:bg-red-50/90 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => deleteVideo(video._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">{video.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <User className="w-3 h-3" />
                        <span className="truncate">{video.author.name}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent text-xs" onClick={() => window.open(video.videoLink, "_blank") }>
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
  );
}
