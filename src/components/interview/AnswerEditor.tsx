import React from 'react'
import { Send } from 'lucide-react'
import { AyuButton } from '../ui/AyuButton'
import { AyuTextarea } from '../ui/AyuInput'

export interface AnswerEditorProps {
  typedInput: string
  onChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const AnswerEditor: React.FC<AnswerEditorProps> = ({
  typedInput,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 py-2">
      <AyuTextarea
        label="Type Your Statement in Everyday Language"
        rows={4}
        required
        value={typedInput}
        onChange={(e) => onChange(e.target.value)}
        placeholder='e.g., "I usually notice it after working long hours under bright fluorescent screens, especially after skipping lunch."'
        helperText="Your natural language statement will be synthesized into clinical entities for your care team."
      />

      <div className="flex items-center justify-end">
        <AyuButton
          variant="primary"
          size="md"
          type="submit"
          rightIcon={<Send className="w-4 h-4" />}
          disabled={!typedInput.trim()}
        >
          Structure Answer
        </AyuButton>
      </div>
    </form>
  )
}
