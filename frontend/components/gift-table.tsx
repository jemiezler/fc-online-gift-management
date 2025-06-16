"use client"

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"

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

export function transformGiftData(data: GiftResponse[]) {
  const rows: TransformedRow[] = []
  const matchMap = new Map<string, Set<string>>()

  for (const user of data) {
    const result: TransformedRow = { wristBandNumber: user.wristBandNumber }

    for (const gift of user.gifts) {
      const match = gift.match ?? "-"
      const round = gift.round ?? "-"
      const key = `${match}-${round}`

      // Status: win / lose / -
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

  // Generate all column keys for consistent rendering
  const allColumns = groupedHeaders.flatMap((group) => group.rounds.map((round) => `${group.match}-${round}`))

  return (
    <div className="overflow-auto">
      <Table aria-label="Gift Results Table" className="min-w-full">
        <TableHeader>
          <TableColumn key="wristBandNumber">
            Wristband
          </TableColumn>
          {groupedHeaders.flatMap((group) =>
            group.rounds.map((round) => (
              <TableColumn key={`${group.match}-${round}`} className="text-center">
                Match {group.match} - R{round}
              </TableColumn>
            )),
          )}
        </TableHeader>

        <TableBody emptyContent="No data available">
          {rows.map((row) => (
            <TableRow key={row.wristBandNumber}>
              <TableCell className="font-medium">{row.wristBandNumber}</TableCell>
              {allColumns.map((columnKey) => {
                const cell = row[columnKey] as TransformedCell | undefined

                if (!cell) {
                  return (
                    <TableCell key={`${row.wristBandNumber}-${columnKey}`} className="text-center">
                      <div className="text-gray-400">-</div>
                    </TableCell>
                  )
                }

                const { result, isClaimed, giftNumber } = cell

                return (
                  <TableCell key={`${row.wristBandNumber}-${columnKey}`} className="text-center">
                    <div className="flex flex-col items-center gap-1 text-xs">
                      <div
                        className={`font-bold uppercase ${
                          result === "win" ? "text-green-600" : result === "lose" ? "text-red-600" : "text-gray-500"
                        }`}
                      >
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
