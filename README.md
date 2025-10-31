# Web Soft Computing - Frontend

Website modern untuk eksplorasi algoritma soft computing dengan implementasi interaktif.

## 🚀 Fitur Utama

- **Modern UI/UX**: Desain yang bersih dan ergonomis dengan Tailwind CSS v4
- **Sidebar Navigation**: Navigasi yang intuitif dan responsive
- **API Integration**: Terintegrasi dengan backend Python Flask
- **Algorithm Pages**: Halaman interaktif untuk setiap algoritma
- **Real-time Visualization**: Visualisasi hasil algoritma secara real-time
- **Type-safe**: Full TypeScript support

## 📂 Struktur Proyek

```
front-end-js/
├── app/
│   ├── algorithms/           # Halaman algoritma
│   │   ├── fuzzy/
│   │   └── neural-network/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   └── ui/              # Reusable UI components
│   ├── lib/
│   │   ├── api/             # API client & services
│   │   ├── constants/       # Konstanta & konfigurasi
│   │   └── utils/           # Helper functions
│   ├── globals.css          # Global styles (Tailwind v4)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
└── public/
```

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: DaisyUI + Custom Components
- **State Management**: React Hooks
- **API Client**: Custom Fetch wrapper

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
copy .env.local.example .env.local
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🎨 Component Library

### UI Components
- `Card` - Kartu konten dengan hover effects
- `Button` - Tombol dengan berbagai variant
- `Badge` - Status badge dengan warna
- `Spinner` - Loading indicator
- `Accordion` - Collapsible content

### Layout Components
- `Sidebar` - Navigasi samping yang collapsible
- `Header` - Top bar dengan search dan status API

## 🔌 API Integration

API client berada di `lib/api/`:
- `client.ts` - Base fetch wrapper
- `service.ts` - API endpoints
- `types.ts` - TypeScript types

Contoh penggunaan:
```typescript
import { apiService } from '@/app/lib/api/service';

const result = await apiService.fuzzy.classifyTemperature(25);
```

## 📖 Halaman Algoritma

### Fuzzy Logic (`/algorithms/fuzzy`)
- Input: Slider temperature
- Output: Klasifikasi & membership values
- Visualisasi: Progress bar & memberships

### Neural Network (`/algorithms/neural-network`)
- Input: Training epochs
- Output: Loss, accuracy, training results
- Visualisasi: Metrics & training progress

## 🎯 Best Practices

1. **Component Structure**: Setiap component di file terpisah
2. **Type Safety**: Gunakan TypeScript untuk semua props
3. **Reusability**: Buat component yang reusable
4. **API Calls**: Centralized di `lib/api/service.ts`
5. **Styling**: Gunakan Tailwind classes dengan utility `cn()`

## 🚀 Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Environment Variables

- `NEXT_PUBLIC_API_URL` - URL backend API (default: http://127.0.0.1:5000)

## 🎨 Tailwind v4 Features

- Modern gradient syntax: `bg-linear-to-br`
- Custom theme configuration in `globals.css`
- DaisyUI integration untuk components
- Custom animations & transitions

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

