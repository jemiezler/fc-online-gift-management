// @ts-nocheck
"use client"

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Checkbox,
  Divider,
} from "@heroui/react"
import { useState } from "react"

export type GiftResponse = {
  wristBandNumber: string
  gifts: {
    questionId: string
    isClaimed: boolean
    match: string
    round: string
    winner?: string
    answer?: string
    isCorrect?: boolean
    giftNumber?: string
  }[]
}

type CellValue = "win" | "lose" | "-"

type TransformedCell = {
  result: CellValue
  isClaimed: boolean
  giftNumber: string
}

type TransformedRow = {
  wristBandNumber: string
  [key: string]: string | TransformedCell
}

function groupGiftsByMatch(gifts: GiftResponse["gifts"]) {
  const result: Record<
    string,
    {
      round: string
      questionId: string
      isClaimed: boolean
      isCorrect?: boolean
      giftNumber?: string
    }[]
  > = {}

  for (const gift of gifts) {
    const match = gift.match ?? "-"
    if (!result[match]) result[match] = []
    result[match].push({
      round: gift.round,
      questionId: gift.questionId,
      isClaimed: gift.isClaimed,
      isCorrect: gift.isCorrect,
      giftNumber: gift.giftNumber,
    })
  }

  for (const rounds of Object.values(result)) {
    rounds.sort((a, b) => Number(a.round) - Number(b.round))
  }

  return result
}

export function transformGiftData(data: GiftResponse[]) {
  const rows: TransformedRow[] = []
  const matchMap = new Map<string, Set<string>>()

  for (const user of data) {
    const result: TransformedRow = { wristBandNumber: user.wristBandNumber }

    for (const gift of user.gifts) {
      const match = gift.match ?? "-"
      const round = gift.round ?? "-"
      const key = `${match}-${round}`

      const status: CellValue = gift.isCorrect === true ? "win" : gift.isCorrect === false ? "lose" : "-"

      result[key] = {
        result: status,
        isClaimed: gift.isClaimed,
        giftNumber: gift.giftNumber ?? "-",
      }

      if (!matchMap.has(match)) matchMap.set(match, new Set())
      matchMap.get(match)!.add(round)
    }

    rows.push(result)
  }

  const groupedHeaders = Array.from(matchMap.entries()).map(([match, rounds]) => ({
    match,
    rounds: Array.from(rounds).sort((a, b) => Number.parseInt(a) - Number.parseInt(b)),
  }))

  return { rows, groupedHeaders }
}

export function GiftTable({ data }: { data: GiftResponse[] }) {
  const { rows, groupedHeaders } = transformGiftData(data)
  const allColumns = groupedHeaders.flatMap((group) =>
    group.rounds.map((round) => `${group.match}-${round}`),
  )

  const [selectedUser, setSelectedUser] = useState<GiftResponse | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const { isOpen, onOpen, onClose } = useDisclosure()

  const openClaimModal = (user: GiftResponse) => {
    setSelectedUser(user)
    setSelected(new Set())
    onOpen()
  }

  const toggleSelect = (questionId: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) newSet.delete(questionId)
      else newSet.add(questionId)
      return newSet
    })
  }

  const handleClaim = async () => {
    if (!selectedUser || selected.size === 0) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wristBandNumber: selectedUser.wristBandNumber,
          questionIds: Array.from(selected),
        }),
      })

      alert(`Claimed ${selected.size} gift(s)`)
      window.location.reload()
    } catch (error) {
      alert("Claim failed")
      console.error(error)
    }
  }

  return (
    <>
      <div className="overflow-auto">
        <Table aria-label="Gift Results Table" className="min-w-full">
          <TableHeader>
            <>
              <TableColumn key="wristBandNumber">Wristband</TableColumn>
              {groupedHeaders.flatMap((group) =>
                group.rounds.map((round) => (
                  <TableColumn key={`${group.match}-${round}`} className="text-center">
                    Match {group.match} - R{round}
                  </TableColumn>
                ))
              )}
              <TableColumn key="actions" className="text-center">Actions</TableColumn>
            </>
          </TableHeader>


          <TableBody emptyContent="No data available">
            {rows.map((row) => {
              const userData = data.find((d) => d.wristBandNumber === row.wristBandNumber)!

              return (

                <TableRow key={row.wristBandNumber}>
                  <TableCell className="font-medium">{row.wristBandNumber}</TableCell>

                  {allColumns.map((columnKey) => {
                    const cell = row[columnKey] as TransformedCell | undefined
                    const questionId = userData.gifts.find((g) => `${g.match}-${g.round}` === columnKey)?.questionId

                    if (!cell || !questionId) {
                      return (
                        <TableCell key={`${row.wristBandNumber}-${columnKey}`} className="text-center text-gray-400">
                          -
                        </TableCell>
                      )
                    }

                    const { result, isClaimed, giftNumber } = cell

                    return (
                      <TableCell key={`${row.wristBandNumber}-${columnKey}`} className="text-center">
                        <div className="flex flex-col items-center gap-1 text-xs">
                          <div className={`font-bold uppercase ${result === "win" ? "text-green-600" : result === "lose" ? "text-red-600" : "text-gray-500"}`}>
                            {result}
                          </div>
                          <div className="text-gray-600">🎁 {giftNumber}</div>
                          <div className={`text-xs ${isClaimed ? "text-green-500" : "text-gray-400"}`}>
                            {isClaimed ? "Claimed" : "Unclaimed"}
                          </div>
                        </div>
                      </TableCell>
                    )
                  })}

                  <TableCell className="text-center">
                    <Button
                      onPress={() => openClaimModal(userData)}
                      color="primary"
                      radius="full"
                    >
                      Claim Gifts
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>

        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="text-lg font-semibold">
            Claim Gifts for WristBand No. {selectedUser?.wristBandNumber}
          </ModalHeader>

          <ModalBody>
            {selectedUser ? (
              Object.entries(groupGiftsByMatch(selectedUser.gifts)).map(([match, items]) => {
                const unclaimedItems = items.filter((g) => !g.isClaimed)
                const allSelected = unclaimedItems.every((g) => selected.has(g.questionId))
                const someSelected = unclaimedItems.some((g) => selected.has(g.questionId))

                const handleToggleAll = () => {
                  setSelected((prev) => {
                    const newSet = new Set(prev)
                    if (allSelected) {
                      unclaimedItems.forEach((g) => newSet.delete(g.questionId))
                    } else {
                      unclaimedItems.forEach((g) => newSet.add(g.questionId))
                    }
                    return newSet
                  })
                }

                return (
                  <div key={match} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-semibold text-gray-700">🎯 Match {match}</h4>
                      <Checkbox
                        isSelected={allSelected}
                        isIndeterminate={!allSelected && someSelected}
                        onValueChange={handleToggleAll}
                        className="text-sm"
                      >
                        Select All
                      </Checkbox>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[...items].sort((a, b) => {
                        const aNum = parseInt(a.giftNumber ?? "0")
                        const bNum = parseInt(b.giftNumber ?? "0")
                        return aNum - bNum
                      }).map((gift) => {
                        const status =
                          gift.isCorrect === true ? "Win" :
                            gift.isCorrect === false ? "Lose" : "-"

                        const statusColor =
                          gift.isCorrect === true
                            ? "bg-green-100 text-green-700"
                            : gift.isCorrect === false
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"

                        return (
                          <div
                            key={gift.questionId}
                            className="flex items-start gap-2 bg-gray-50 px-3 py-2 rounded-md hover:bg-gray-100 transition-all text-sm"
                          >
                            <Checkbox
                              isSelected={selected.has(gift.questionId)}
                              isDisabled={gift.isClaimed}
                              onValueChange={() => toggleSelect(gift.questionId)}
                              className="mt-1"
                            />
                            <div className="flex flex-col">
                              <div className="font-medium text-gray-800">
                                🎁 Gift No. {gift.giftNumber ?? "-"} — Round: {gift.round}
                              </div>
                              <div className={`text-xs mt-0.5 px-2 py-0.5 rounded ${statusColor}`}>
                                {gift.isClaimed ? "Already Claimed" : status}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onPress={onClose} variant="light">
              Cancel
            </Button>
            <Button color="primary" onPress={handleClaim} isDisabled={selected.size === 0}>
              Confirm Claim ({selected.size})
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
