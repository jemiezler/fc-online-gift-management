"use client"

import { useEffect, useState } from "react"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Input } from "@heroui/react"

type Question = {
  _id: string
  match: string
  round: string
  winner?: string
  giftCorrect?: number
  giftWrong?: number
}

export default function WinnerPatch() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [editing, setEditing] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchQuestions = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions`)
    const data = await res.json()
    setQuestions(data)
  }

  const handleSave = async () => {
    if (!editing) return

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/${editing._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        winner: editing.winner,
        giftCorrect: editing.giftCorrect,
        giftWrong: editing.giftWrong,
      }),
    })

    setEditing(null)
    fetchQuestions()
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">❓ Manage Questions</h2>

      <Table aria-label="Questions Table">
        <TableHeader>
          <TableColumn>Match</TableColumn>
          <TableColumn>Round</TableColumn>
          <TableColumn>Winner</TableColumn>
          <TableColumn>Gift (✓/✗)</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {questions.map((q) => (
            <TableRow key={q._id}>
              <TableCell>{q.match}</TableCell>
              <TableCell>{q.round}</TableCell>
              <TableCell>{q.winner || "-"}</TableCell>
              <TableCell>{q.giftCorrect ?? 0} / {q.giftWrong ?? 0}</TableCell>
              <TableCell>
                <Button onPress={() => setEditing(q)} size="sm" color="primary">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <Modal isOpen={true} onClose={() => setEditing(null)} size="md">
          <ModalContent>
            <ModalHeader>Edit Question (Match {editing.match} - R{editing.round})</ModalHeader>
            <ModalBody className="space-y-4">
              <Input
                label="Winner"
                value={editing.winner || ""}
                onChange={(e) => setEditing({ ...editing, winner: e.target.value })}
              />
              <Input
                label="Gifts for Correct Answer"
                type="number"
                value={editing.giftCorrect?.toString() || "0"}
                onChange={(e) =>
                  setEditing({ ...editing, giftCorrect: parseInt(e.target.value) })
                }
              />
              <Input
                label="Gifts for Wrong Answer"
                type="number"
                value={editing.giftWrong?.toString() || "0"}
                onChange={(e) =>
                  setEditing({ ...editing, giftWrong: parseInt(e.target.value) })
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => setEditing(null)} variant="light">
                Cancel
              </Button>
              <Button onPress={handleSave} color="primary">
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}
