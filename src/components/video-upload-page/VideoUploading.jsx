import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Upload, User, Video, Lock } from "lucide-react";

export default function VideoUploading({ onUpload }) {
  const [formData, setFormData] = useState({
    videoLink: "",
    unitName: "",
    private: false,
    name: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onUpload) {
      await onUpload(formData, setFormData);
    }
  };

  return (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                name
              </Label>
              <Input id="author" type="text" placeholder="Enter video title name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Unit Name
              </Label>
              <select value={formData.unitName} onChange={(e) => handleInputChange("unitName", e.target.value)} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 w-full rounded-md">
                <option value="">Select a unit</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={`Unit ${i + 1}`}>{`Unit ${i + 1}`}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoLink" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                YouTube Link
              </Label>
              <Input id="videoLink" type="url" placeholder="https://www.youtube.com/watch?v=..." value={formData.videoLink} onChange={(e) => handleInputChange("videoLink", e.target.value)} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500" required />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                Privacy & Action
              </Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Private</span>
                  <Switch id="private" checked={formData.private} onCheckedChange={(checked) => handleInputChange("private", checked)} className="data-[state=checked]:bg-purple-600" />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm font-medium">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
