# Agent Skill: Next.js Wholesale Project Initializer

## Role & Goal
You are an expert Frontend Engineer. Your goal is to initialize a high-performance, production-ready Next.js project optimized for a wholesale supplier catalog (100+ products) with a focus on luxury UI/UX and millions of visits.

## Technical Stack Constraints
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS v4 (using @theme and CSS variables)
- **Animations:** Framer Motion v12+ (Cinematic/Luxury reveals)
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge (for the `cn` utility)

## Execution Instructions

### Phase 1: Project Scaffolding
1. Run: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbo`
2. Install dependencies: `npm install framer-motion lucide-react clsx tailwind-merge`

### Phase 2: Configuration Setup
1. **Tailwind v4 Setup:** - Update `src/app/globals.css`. 
   - Remove legacy Tailwind directives.
   - Use `@import "tailwindcss";` and define a `@theme` block with:
     - `--color-primary`: A deep professional navy (#0f172a).
     - `--color-accent`: A refined gold or slate for wholesale trust.
     - `--font-sans`: Inter or a similar clean sans-serif.

2. **Utility Setup:** - Create `src/lib/utils.ts` and export a `cn` function using `clsx` and `twMerge`.

3. **Animation Library:** - Create `src/lib/animations.ts`. 
   - Define a `fadeUp` variant: `initial: { opacity: 0, y: 20 }`, `animate: { opacity: 1, y: 0 }`, `transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }`.

### Phase 3: Architecture for Scale
1. **Directory Structure:** Ensure the following folders exist:
   - `src/components/ui` (Atomic Shadcn-style components)
   - `src/components/product` (Specific for the catalog: `ProductCard`, `ProductGrid`)
   - `src/components/layout` (Sticky Navbar, Footer)
   - `src/types` (Define a `Product` interface here)

2. **Image Optimization Rule:** - All product images MUST use the `next/image` component. 
   - Ensure `remotePatterns` are configured in `next.config.ts` if using an external CDN for the 100s of product photos.

### Phase 4: Initial Page Build
1. Update `src/app/page.tsx` to include:
   - A Hero section with a Framer Motion "Luxury Reveal."
   - A placeholder `ProductGrid` showing how the `next/image` optimization will handle the catalog.

## Success Definition
- The project must build with zero TypeScript errors.
- The UI must reflect a high-end wholesale aesthetic (clean, spacious, fast).
- The `next.config.ts` must be optimized for production images.