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
        Steady hakkında
      </button>

      <Modal
        open={open}
        title="Steady hakkında"
        description="İstikrarı kur. Her seferinde bir oturum."
        size="sm"
        onClose={() => setOpen(false)}
        footer={
          <Button size="sm" onClick={() => setOpen(false)}>
            Kapat
          </Button>
        }
      >
        <p className="about__text">
          Steady, günlük kullanım için bir odak zamanlayıcısı ve görev yöneticisidir. Gerçek bir
          arka uç ve gerçek bir veritabanıyla geliştirilmiş bir portföy projesidir.
        </p>
        <p className="about__heading">Şunlarla geliştirildi</p>
        <ul className="planned__list">
          {STACK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
