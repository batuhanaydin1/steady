import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, TextField } from '../../components/ui/index.ts'
import { TITLE_MAX_LENGTH, validateTitle } from './tasks.ts'
import type { TaskDraft } from './tasksContext.ts'

interface TaskComposerProps {
  onCreate: (draft: TaskDraft) => Promise<void>
  saving: boolean
}

/**
 * Inline quick-add form. It only asks for a title — notes are added by
 * editing the task, which keeps the top of the list calm.
 */
export function TaskComposer({ onCreate, saving }: TaskComposerProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const invalid = validateTitle(title)
    setError(invalid)
    if (invalid) return

    try {
      await onCreate({ title, notes: null })
      setTitle('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Görev eklenemedi.')
    }
  }

  return (
    <form className="task-composer" onSubmit={submit} noValidate>
      <TextField
        label="Yeni görev"
        placeholder="Neye odaklanmak istiyorsun?"
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        error={error}
        hideLabel
        autoComplete="off"
        onChange={(event) => {
          setTitle(event.target.value)
          if (error) setError(null)
        }}
      />
      <Button type="submit" loading={saving} disabled={title.trim().length === 0}>
        Görev ekle
      </Button>
    </form>
  )
}
