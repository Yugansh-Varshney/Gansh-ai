# Gansh AI (Frontend)

## Quickstart

```bash
npm install
npm run dev:all
```

Open `http://127.0.0.1:5173/`.

## Form email (Resend)

The landing page contact form posts to `POST /api/leads` (proxied to the local server).

- Copy `env.example` to `.env`
- Set `RESEND_API_KEY`, `TO_EMAIL`, and `FROM_EMAIL`
