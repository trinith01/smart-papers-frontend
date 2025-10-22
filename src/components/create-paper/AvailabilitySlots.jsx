"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, Plus, X } from "lucide-react"

export default function AvailabilitySlots({
  availability,
  institutes,
  addAvailabilitySlot,
  updateAvailability,
  removeAvailabilitySlot,
  isSubmitting
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Institute Availability
        </CardTitle>
        <CardDescription>
          Set availability times for different institutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availability.map((slot) => (
          <Card key={slot.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Institute</Label>
                <Select
                  value={slot.institute || ""}
                  onValueChange={(value) =>
                    updateAvailability(slot.id, "institute", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select institute" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map((institute) => (
                      <SelectItem key={institute._id} value={institute._id}>
                        {institute.name} - {institute.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="datetime-local"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateAvailability(slot.id, "startTime", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="datetime-local"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateAvailability(slot.id, "endTime", e.target.value)
                  }
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeAvailabilitySlot(slot.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        <Button
          onClick={addAvailabilitySlot}
          variant="outline"
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Institute Availability
        </Button>
      </CardContent>
    </Card>
  )
}
