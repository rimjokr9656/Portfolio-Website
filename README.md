# Classic Portfolio Website — Rimjo K. R

A premium, minimal, editorial-style interactive portfolio website designed for **Rimjo K. R**, Digital Marketing Professional, Content Creator, and Visual Storyteller. 

Inspired by a high-end printed portfolio converted into a responsive, engaging digital experience.

---

## 🎨 Design Direction

- **Style:** Minimalist, Editorial, Modern Magazine Layout.
- **Background:** `#F6F6F6` (Creamy off-white)
- **Primary Text:** `#222222` (Rich carbon black)
- **Secondary Text:** `#555555` (Slate grey)
- **Accent Color:** `#F4B223` (Vibrant golden yellow)
- **Typography:**
  - Headings: `Baloo 2 ExtraBold` (large, bold, heavy visual weight)
  - Body & Labels: `Poppins` (clean, geometric, geometric sans-serif)

---

## ✨ Features & Micro-Animations (GSAP)

1. **Custom Interactive Cursor:** Smooth double-element follower cursor that scales and glows on hovering links, buttons, and cards.
2. **Hero Animation Timeline:** Sequence revealing the title, subtitle, and portrait with floating doodles and rotating outline frames on initial load.
3. **Parallax Mouse Interactions:** Background marketing widgets drift dynamically relative to mouse coordinates inside the Hero viewport.
4. **Magnetic Elements:** Sticky magnetic pull when hovering over the logo, navigation links, and social circles.
5. **Achievement Counters:** Numeric statistics (ranks, percentages, efficiency multipliers) slide-count from zero to target values on scroll entry.
6. **Scroll-Reveals:** Sections and card grids fade and slide upward elegantly when scrolled into view.
7. **Client-Side Form Validation:** Inline error triggers with animated validation feedback on submission success.

---

## 📂 Folder Structure

```
portfolio/
│
├── index.html            # Main markup and SEO schema structured metadata
├── css/
│   ├── style.css         # Main stylesheet (base, variables, layout, grids)
│   ├── responsive.css    # Media queries for fluid responsive stacking
│   └── animation.css     # Transitions, hover lift shadow effects, and keyframes
│
├── js/
│   ├── script.js         # Core behavior (active nav, form validation, lazy load)
│   ├── gsap.js           # Scroll triggers, magnetic effects, count anims, parallax
│   └── cursor.js         # Custom mouse tracking logic
│
├── assets/
│   ├── images/
│   │   └── rimjo_portrait.jpeg   # High contrast grayscale profile image
│   ├── icons/            # SVG vector assets
│   ├── fonts/            # Custom type configurations
│   └── resume/           # Placeholder for resume PDF
│
└── README.md             # Project documentation
```

---

## 🚀 How to Run Locally

### Option A: Python HTTP Server (Recommended)
Launch a local development server from the project directory:
```bash
python -m http-server
```
or 
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option B: Node.js (http-server)
Run using Node:
```bash
npx -y http-server
```

---

## 🔍 SEO & Optimization

- **Semantic HTML5:** Built using `<header>`, `<section>`, `<article>`, `<footer>` tags.
- **Metadata:** Open Graph (Facebook/LinkedIn) and Twitter Card tags configured with previews.
- **JSON-LD Schema:** Structured data schema `Person` embedded to assist Google Search bots indexing Rimjo's professional profile.
- **Optimized Asset Loading:** Lazy loading (`loading="lazy"`) and optimized vector graphics (SVGs) for rapid loading times.
