import { useState } from 'react'
import { Button, Modal } from '../ui/index.ts'

const STACK = [
  'React 19 + Vite + TypeScript',
  'ASP.NET Core Web API (C#)',
  'Entity Framework Core + Npgsql',
  'PostgreSQL',
]

/** Small, fully working dialog — also the reference implementation for later modals. */
export function AboutDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="link-button" onClick={() => setOpen(true)}>
        About Steady
      </button>

      <Modal
        open={open}
        title="About Steady"
        description="Build consistency. One session at a time."
        size="sm"
        onClose={() => setOpen(false)}
        footer={
          <Button size="sm" onClick={() => setOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="about__text">
          Steady is a focus timer and task manager for everyday use. It is built as a portfolio
          project with a real backend and a real database.
        </p>
        <p className="about__heading">Built with</p>
        <ul className="planned__list">
          {STACK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
