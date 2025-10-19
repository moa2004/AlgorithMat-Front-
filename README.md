<p align="center">
  <img src="src/assets/algorithmat-logo.svg" alt="AlgorithMat Logo" width="180"/>
</p>

<h1 align="center">⚙️ AlgorithMat Problem-Solving Platform (Front-End)</h1>

<p align="center">
  A modern and accessible web platform that empowers learners to enhance their coding and problem-solving skills.  
  Built with ❤️ using React, Vite, and pure CSS for unmatched performance and style.
</p>

---

## 🧭 Overview

The **AlgorithMat** platform is a web application that empowers learners to practice coding problems, review detailed submission feedback, and explore curated content that accelerates their competitive programming journey.

It provides:
- A welcoming home page  
- Problem exploration workflows  
- Detailed submission history  
- Profile insights  

All built with a focus on **responsiveness**, **accessibility**, and **maintainability**.

---

## 🚀 Key Features

- **🔐 Authentication Experience:**  
  Dedicated login & registration pages with friendly error handling and accessibility-focused UI.

- **🏠 Home Dashboard:**  
  Hero section, dynamic statistics, trending problems, and recent submissions — all presented in clean, animated cards.

- **🧩 Problem Management:**  
  Full browsing, detailed problem pages, and an admin interface for adding new challenges.

- **🧠 Submission Insights:**  
  Interactive modal that displays compiler metadata, runtime, and test-case outcomes.

- **👤 Profile Overview:**  
  Manage user data with a stats-driven layout and summary cards.

- **🎨 Pure CSS Styling:**  
  Handcrafted animations and layouts — no external UI frameworks, full control over the design.

---

## 🛠️ Technology Stack

| Tool | Purpose |
|------|----------|
| ⚛️ **React 19** | Component-based architecture with modern hooks |
| ⚡ **Vite 7** | Lightning-fast dev server & optimized production builds |
| 🔀 **React Router DOM 7** | Nested routing & navigation |
| 🌐 **Axios** | HTTP client for API communication |
| 📊 **Recharts 3** | Data visualization and stats charts |
| 🎨 **Pure CSS** | Framework-free handcrafted styling |
| 🧹 **ESLint 9** | Code linting for consistency and readability |

---

## 📁 Project Structure

```
src/
  Components/
    Home/               # Hero, Features, Stats, etc.
    miniComponents/     # Buttons, Spinners, Modals...
    Problem Components/ # Problem navigation and UI
  Pages/
    Home/               # Dashboard layout
    Login&SinUp/        # Authentication pages
    Problems/           # Problem listing & detail
    Submisions/         # Submissions & test results
  hooks/
    usePasswordStrength.js
  App.jsx               # Root layout and routes
  main.jsx              # Application bootstrap
```

---

## ⚙️ Getting Started

### 1️⃣ Install prerequisites
- Node.js ≥ 18.0.0  
- npm (bundled with Node.js)

### 2️⃣ Clone the repository
```bash
git clone https://github.com/moa2004/AlgorithMat-Front-.git
cd AlgorithMat-Front-
```

### 3️⃣ Install dependencies
```bash
npm install
```

### 4️⃣ Run the development server
```bash
npm run dev
```
Access the app at the URL shown in the terminal (default: `http://localhost:5173`).

### 5️⃣ Build for production
```bash
npm run build
```

### 6️⃣ Preview the production build
```bash
npm run preview
```

---

## 🌍 Environment & API Configuration

- Default backend API:  
  `http://problem-solving.runasp.net/api/v1/`
- To change API base URLs → edit the fetch or Axios calls inside:
  - `Home.jsx`
  - `Submissions` pages  
  - Service helpers (if added)

⚠️ Authentication tokens are stored in `localStorage` under `userAuth`.  
For production: prefer HTTPS and consider migrating to **HTTP-only cookies** for enhanced security.

---

## 💅 Styling Guidelines

- All styles live beside their component (`.css` per component).  
- Follow **BEM-inspired** naming to prevent collisions.  
- Use semantic color tokens to keep good contrast.  
- Avoid frameworks to preserve lightweight, custom styling.

---

## ♿ Accessibility & UX

- Modals maintain focus traps and announce changes (`aria-live`).  
- Form fields have accessible labels and validation feedback.  
- Keyboard navigation supported across all components.  
- Colors meet **WCAG** contrast standards.

---

## 🧩 Available npm Scripts

| Script | Description |
|---------|-------------|
| `npm run dev` | Launch dev server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint code analysis |

---

## 🧠 Potential Enhancements

- Add `.env` variables for API configuration.  
- Add tests via **Vitest** or **React Testing Library**.  
- Implement CI checks (lint + build).  
- Expand data visualizations with Recharts.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Ensure lint passes  
4. Submit a detailed PR with screenshots if UI changes are made  

---

## 📜 License

> The license for this project has not been specified.  
> Please consult the project owner or add a LICENSE file.

---

## 💬 Support

For bugs, questions, or feature requests:
- Open an **Issue** on [GitHub](https://github.com/moa2004/AlgorithMat-Front-/issues)
- Include screenshots and clear reproduction steps  
- Provide network logs when facing API issues  

---

<p align="center">✨ Enjoy building and iterating on <b>AlgorithMat</b>! 🎯</p>
