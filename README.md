Content Publishing System
A full-stack web application that allows authors to create, edit, publish, and manage articles.
Tech Stack
Frontend

Next.js
React (Hooks)
React Query
React Quill
TailwindCSS

⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/laradesu/content-publishing-system-front.git
cd content-publishing-system-front
▶️ How to Run the Project
🔹 frontend Setup
cd frontend
npm install
npm run dev/start
Front runs 
http://localhost:3002

🏗 Architecture Overview
📂 Project Structure
content-publishing-system-front/
│
├── frontend/
         app
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── utils/
     --service
      --types

      Frontend follows:

Component-based architecture
React Query for data fetching
Reusable hooks
Modal-based form management
app routing=>content publishingsystem component=>hooks=>service=>types

✨ Implemented Features

Rich text editor (React Quill)

Markdown preview
Autosave drafts (localStorage)
Article filtering & pagination
Grid/List view toggle
