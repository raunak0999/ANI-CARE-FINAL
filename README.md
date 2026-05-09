<div align="center">

<img src="https://img.shields.io/badge/AniCare-🐾-orange?style=for-the-badge" alt="AniCare" />

# 🐾 AniCare — Smart Pet Care Made Simple

**AI-powered pet care platform with personalised recommendations, training videos, a product shop, and a social reel feed — all in one place.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-state-brown?style=flat-square)](https://zustand-demo.pmnd.rs)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai)](https://openai.com)

[✨ Live Demo](https://ani-caree.onrender.com) · [🐛 Report Bug](../../issues) · [💡 Request Feature](../../issues)

</div>

---

## 📸 Preview

> *A modern pet care web app built for Indian pet owners — from AI chat to pet reels.*

```
🏠 Hero  →  🐶 Pet Profile  →  🧠 AI Recommendations  →  🛍️ Shop
→  🎬 Training Videos  →  🎥 Pet Reels  →  💬 AI Chatbot
```

---

## ✨ Features

### 🐶 Pet Profile
Create a detailed profile for your pet — name, breed, age, size. The entire app personalises itself around your pet once the profile is submitted.

### 🧠 AI-Powered Care Recommendations
After creating a profile, the backend calls OpenAI GPT-4 to generate personalised care tips across three categories:
- 🥩 **Nutrition** — breed and age-specific diet advice
- ✂️ **Grooming** — coat type and grooming frequency
- ❤️ **Health** — common breed health concerns and vet advice

### 🛍️ Product Shop with Cart
Browse 8+ curated pet products across Food & Treats, Toys, Health, and Grooming. Filter by category. Add to cart — the slide-in **cart drawer** lets you adjust quantities, remove items, and see your subtotal. Cart state persists via Zustand + localStorage.

### 🎬 Training Videos & Tutorials (Breed-Aware)
Training video section that **automatically updates** when a pet profile is created. Each breed has its own curated set of 4 YouTube tutorial videos. Click "Watch Now" to play them in an **in-app modal** — no tab switching. Covers 9 breeds + a default set:

| Breed | Breed | Breed |
|---|---|---|
| Labrador | Golden Retriever | German Shepherd |
| Beagle | Poodle | Husky |
| Bulldog | Shih Tzu | Persian Cat |

### 🎥 Pet Reels — Social Video Feed
An Instagram Reels-style vertical feed where pet owners can **upload and watch short pet videos**.
- Auto-play videos as they scroll into view (IntersectionObserver)
- Like any reel with a ❤️ button
- Upload your own reel with a caption and your name
- Videos stored server-side via Multer

### 💬 AI Pet Chatbot
A full-featured chat UI powered by OpenAI — ask anything about your pet's health, diet, training, or behaviour. The bot is aware of your pet's profile for contextual answers. Features typing indicator, message timestamps, and suggested starter questions.

### 🏢 Company Showcase
Highlights partner brands and trusted companies in the pet care industry.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State** | Zustand (cart), React Query (server state) |
| **Backend** | Node.js, Express |
| **AI** | OpenAI GPT-4 (chat + recommendations) |
| **File Uploads** | Multer (multipart, disk storage) |
| **Database** | In-memory (extendable to PostgreSQL/Firebase) |
| **Deployment** | Render.com |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- An OpenAI API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ani-caree.git
cd ani-caree

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# 4. Run the development server
npm run dev
```

The app runs on `http://localhost:5000` — the Express server serves both the API and the Vite frontend.

### Environment Variables

Create a `.env` file in the root:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

---

## 📁 Project Structure

```
ani-caree/
├── client/                     # React frontend
│   └── src/
│       ├── components/
│       │   ├── navigation.tsx          # Navbar + cart drawer
│       │   ├── hero-section.tsx        # Landing hero
│       │   ├── pet-profile-form.tsx    # Pet profile creation
│       │   ├── care-recommendations.tsx # AI care tips
│       │   ├── product-catalog.tsx     # Shop with cart
│       │   ├── training-section.tsx    # Breed-aware video tutorials
│       │   ├── pet-reels.tsx           # Social video feed
│       │   ├── ai-chat.tsx             # AI chatbot UI
│       │   ├── company-showcase.tsx    # Partner brands
│       │   └── footer.tsx
│       ├── hooks/
│       │   ├── use-cart.ts             # Zustand cart store
│       │   └── use-toast.ts
│       └── pages/
│           └── home.tsx
├── server/
│   ├── index.ts                # Express entry point
│   ├── routes.ts               # All API routes
│   ├── storage.ts              # Data persistence layer
│   └── services/
│       └── openai.ts           # GPT-4 integration
├── shared/
│   └── schema.ts               # Shared TypeScript types + Zod schemas
└── uploads/                    # Multer file storage (reel videos)
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pet-profiles` | Create pet profile, get AI recommendations |
| `GET` | `/api/pet-profiles` | Fetch current profile + recommendations |
| `POST` | `/api/chat` | Send message to AI chatbot |
| `POST` | `/api/chat-messages` | Save chat history |
| `GET` | `/api/products` | List products (optional `?category=` filter) |
| `POST` | `/api/reels` | Upload a pet reel (multipart/form-data) |
| `GET` | `/api/reels` | List all reels (newest first) |
| `GET` | `/uploads/:filename` | Serve uploaded video files |

---

## 🗺️ Roadmap

- [ ] User authentication (Firebase Auth / JWT)
- [ ] Persistent database (PostgreSQL or Firestore)
- [ ] Cloud video storage (Cloudinary / Firebase Storage)
- [ ] Reel comments and replies
- [ ] Vet appointment booking
- [ ] Push notifications for care reminders
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please keep PRs focused — one feature or fix per PR.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for pet lovers everywhere 🐾

**[⬆ Back to top](#-anicare--smart-pet-care-made-simple)**

</div>
