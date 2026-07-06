# IdeaVault Frontend 💡

### [🌐 Deployed Live Demo](https://ideavault-frontend-1-acgp.onrender.com)

Welcome to the frontend repository of **IdeaVault** — a secure, production-ready online notepad application designed to capture, structure, filter, and organize software and business ideas.

---

## 🎨 Tech Stack & Features

* **Framework & Build**: [React.js](https://react.dev/) + [Vite](https://vite.dev/)
* **UI Component Library**: [Ant Design](https://ant.design/) (v5)
* **Styling**: Vanilla CSS with Ant Design themes
* **API Client**: [Axios](https://axios-http.com/) (configured with interceptors for JWT injection and automatic session expiry/401 handling)
* **Rich Markdown Editing**: Integrated markdown editors and rendering
* **State Management**: React Context API for global Authentication & Theme states

### Key Features Implemented:
1. **Interactive Analytics Dashboard**: Beautiful metrics cards showing status/priority distributions.
2. **Dynamic Idea Lifecycle**: Complete CRUD capability, search, sorting, and pagination.
3. **Draft Auto-Save**: Automatically stashes active editing inputs every 3 seconds to prevent data loss.
4. **Theme Customization**: Sleek dark and light mode toggle across all layouts.
5. **Interactive Views**: Calendar events view of created ideas.
6. **Flexible Layouts**: Switch view between card grids and robust list tables.

---

## ⚙️ Setup & Development Instructions

### Prerequisites
* **Node.js**: v18 or higher
* **npm**: v9 or higher

### Installation

1. Clone the repository and navigate to the directory:
   ```bash
   cd IdeaVault-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the root of the frontend folder:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   The client will boot up at `http://localhost:5173`.

### Production Build

To build the optimized static assets for production:
```bash
npm run build
```
The output files will be created in the `dist` folder.
