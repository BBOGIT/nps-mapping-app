# File Processing System

A React-based web application for processing and mapping data files with a two-step validation process.

## Features

- File upload support for Excel (.xlsx) and CSV files
- Template-based processing (Shopify, Amazon, Other)
- Two-step data validation and mapping
- Column mapping with automatic conflict resolution
- Preview functionality before final save
- Template saving capability

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React for icons

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
Create a `.env` file with:
```
VITE_API_URL=your_api_url
```
4. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/         # React components
├── services/          # API services
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
└── main.tsx          # Application entry point
```

## API Endpoints

- `POST /parse-file` - Process uploaded file
- `POST /save` - Save processed data
- `POST /save/templates` - Save data template

## Component Flow

1. FileUpload
   - Initial file upload
   - Template selection
2. DataTable
   - Step 1: Column mapping
   - Step 2: Data preview
3. PreviewTable
   - Final data review
   - Save options

## Development

- Run tests: `npm test`
- Build: `npm run build`
- Lint: `npm run lint`