import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Modal, Notice, TextAreaField, TextField } from '../../components/ui/index.ts'
import type { TaskResponse } from '../../types/api.ts'
import {
  NOTES_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  normalizeNotes,
  validateNotes,
  validateTitle,
} from './tasks.ts'
import type { TaskDraft } from './tasksContext.ts'

interface TaskEditDialogProps {
  task: TaskResponse
  onClose: () => void
  /** Rejects with the reason when the change could not be saved. */
  onSubmit: (draft: TaskDraft) => Promise<void>
}

/**
 * Edit dialog for a task's title and notes. Completion is handled by the
 * checkbox on the row itself, which keeps this dialog to one job.
 *
 * Mounted only while it is open, so the fields always start from the task.
 */
export function TaskEditDialog({ task, onClose, onSubmit }: TaskEditDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [notes, setNotes] = useState(task.notes ?? '')
  const [titleError, setTitleError] = useState<string | null>(null)
  const [notesError, setNotesError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextTitleError = validateTitle(title)
    const nextNotesError = validateNotes(notes)
    setTitleError(nextTitleError)
    setNotesError(nextNotesError)
    setFormError(null)
    if (nextTitleError || nextNotesError) return

    setSubmitting(true)
    try {
      await onSubmit({ title, notes: normalizeNotes(notes) })
      onClose()
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'Değişiklikler kaydedilemedi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open
      title="Görev düzenle"
      description="Başlığı ve notları güncelle."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Vazgeç
          </Button>
          <Button type="submit" form="task-edit-form" loading={submitting}>
            Kaydet
          </Button>
        </>
      }
    >
      <form className="task-form" id="task-edit-form" onSubmit={submit} noValidate>
        {formError ? (
          <Notice tone="danger" role="alert">
            {formError}
          </Notice>
        ) : null}

        <TextField
          label="Başlık"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          error={titleError}
          autoComplete="off"
          onChange={(event) => {
            setTitle(event.target.value)
            if (titleError) setTitleError(null)
          }}
        />

        <TextAreaField
          label="Notlar"
          hint={`İsteğe bağlı, en fazla ${NOTES_MAX_LENGTH} karakter.`}
          value={notes}
          maxLength={NOTES_MAX_LENGTH}
          error={notesError}
          onChange={(event) => {
            setNotes(event.target.value)
            if (notesError) setNotesError(null)
          }}
        />
      </form>
    </Modal>
  )
}
