# Next.js Todo App

A modern, full-stack todo application built with Next.js 14 (App Router), tRPC, Neon Postgres, Drizzle ORM, and Shadcn UI.

![App Screenshot](https://i.imgur.com/F8zyksQ.png)

## Features

- Create, read, update, and delete todos
- Optimistic UI updates for instant feedback
- Dark mode support
- PostgreSQL database with Neon
- Type-safe API with tRPC
- Responsive design with Tailwind CSS
- Keyboard shortcuts for power users

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org)
- **Database**: [PostgreSQL (Neon)](https://neon.tech)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **API**: [tRPC](https://trpc.io)
- **UI Components**: [Shadcn](https://ui.shadcn.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/1w6ts/todo-tut.git
   cd todo-tut
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file with the following:

   ```
   DATABASE_URL=your_db_url
   ```

4. **Run database migrations**:

   ```bash
   npm run db:migrate
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   ├── server/               # Server-side code
│   │   ├── api/              # tRPC API routes
│   │   └── db/               # Database schema and client
│   └── utils/                # Utility functions
├── drizzle/                  # Drizzle migrations
├── public/                   # Static assets
├── .env.example              # Example environment variables
├── drizzle.config.ts         # Drizzle configuration
└── next.config.js            # Next.js configuration
```

## Development

### Database Migrations

- **Generate migrations** after schema changes:

```bash
npm run db:generate
```

- **Apply migrations** to the database:

```bash
npm run db:migrate
```

### Adding New Features

1. Define schema changes in `src/server/db/schema.ts`
2. Generate and apply migrations
3. Add tRPC procedures in `src/server/api/routers/`
4. Create or update React components in `src/components/`
5. Update pages in `src/app/`

## Deployment

This application can be deployed to **Vercel** with minimal configuration:

1. Push your code to GitHub
2. Import the project to Vercel
3. Set the environment variables
4. Deploy

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Neon](https://neon.tech)
- [Shadcn UI](https://shadcn.dev)
- [Tailwind CSS](https://tailwindcss.com)
