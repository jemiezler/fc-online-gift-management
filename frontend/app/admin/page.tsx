"use client"
import { Accordion, AccordionItem } from "@heroui/react"
import AnswerUploader from "@/components/answer-uploader"
import WinnerPatch from "@/components/patch-winner"

export default function AdminPage() {
  return (
    <div className="mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin Settings</h1>

      <Accordion variant="bordered" isCompact selectionMode="multiple">
        <AccordionItem key="upload" title="📤 Upload Answer File">
          <div className="mt-4">
            <AnswerUploader />
          </div>
        </AccordionItem>

        <AccordionItem key="winners" title="🏆 Set Question Winners">
          <div className="mt-4">
            <WinnerPatch />
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
