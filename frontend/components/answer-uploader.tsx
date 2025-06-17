"use client"

import { useState } from "react"
import { Input, Button, Card, CardBody } from "@heroui/react"

export default function AnswerUploader() {
  const [match, setMatch] = useState("")
  const [round, setRound] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleUpload = async () => {
    if (!file || !match || !round) {
      alert("Please fill all fields")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("match", match)
    formData.append("round", round)

    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answers/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardBody className="space-y-4">
        <h2 className="text-lg font-semibold">📤 Upload Answers CSV</h2>

        <div className="space-y-2">
          <Input
            type="text"
            label="Match"
            value={match}
            onChange={(e) => setMatch(e.target.value)}
            placeholder="e.g., 1"
            isRequired
          />
          <Input
            type="text"
            label="Round"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            placeholder="e.g., 2"
            isRequired
          />
          <Input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <Button onPress={handleUpload} isLoading={isLoading} color="primary">
          Upload
        </Button>

        {result && (
          <div className="mt-4 text-sm text-gray-700">
            ✅ Uploaded: {result.inserted} inserted, {result.skipped} skipped
          </div>
        )}
      </CardBody>
    </Card>
  )
}
