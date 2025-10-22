"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Eye } from "lucide-react"

export default function PastPapersTable({ pastPapers, handlePreview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          MCQ Papers
        </CardTitle>
        <CardDescription>View and manage created MCQ papers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paper Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Institutes</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastPapers.map((paper) => (
              <TableRow key={paper._id}>
                <TableCell className="font-medium">{paper.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{paper.subject}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{paper.category}</Badge>
                </TableCell>
                <TableCell>{paper.year}</TableCell>
                <TableCell>{paper.questions?.length || 0}</TableCell>
                <TableCell>{paper.availability?.length || 0}</TableCell>
                <TableCell>
                  {new Date(paper.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(paper)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
