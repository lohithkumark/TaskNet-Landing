🎯 TaskNest – Advanced To-Do App & Landing Page

A high-end, fully responsive productivity web application built using pure HTML, CSS, and Vanilla JavaScript.
TaskNest combines a modern marketing landing page with a complete task management system, demonstrating clean UI design, semantic structure, responsiveness, and real application logic.

🚀 Live Demo

🔗 Add your deployment link here (Vercel / GitHub Pages).

✨ Features Overview
📝 Task Management

Add tasks with:

Title

Category (Work / Personal / Study / Other)

Priority (Low / Medium / High)

Optional due date

Mark tasks as completed

Delete tasks

Clear all completed tasks with one click

🔍 Smart Controls

Filters: All, Active, Completed

Live Search: Instant text filtering

Sorting Options:

Newest

Oldest

Due Date

Priority

Task Stats:

Total tasks

Completed percentage

Tasks due today

🌙 Light & Dark Mode

Simple toggle from header

Theme preference saved in localStorage

💾 Persistent Storage

All tasks saved using localStorage

Data remains after refresh or browser restart

📱 Responsive Design

Built with:

CSS Grid

Flexbox

Mobile-first approach

Breakpoints for desktop → tablet → mobile

🧪 Tech Stack
Technology	Purpose
HTML5	Structure & semantics
CSS3	Layout, responsiveness, theming
JavaScript (ES6+)	App logic, interactions, state management
localStorage	Data persistence
No frameworks	Pure front-end project
📸 Screenshots

Replace each placeholder with actual screenshots later.

⭐ Hero Section

Add screenshot here

🧩 Task Creation UI

Add screenshot here

🔍 Filters, Search & Sort

Add screenshot here

📊 Stats & Insights

Add screenshot here

🌗 Light / Dark Mode

Add screenshot here

📱 Mobile Responsive Layout

Add screenshot here

🧠 How It Works
📌 Task Structure
{
  id: string,
  text: string,
  category: string,
  priority: string,
  dueDate: string,
  completed: boolean,
  createdAt: number
}

🔄 Rendering Pipeline

Load tasks from localStorage

Apply filters, search, and sorting

Re-render the list using JavaScript DOM creation

Update stats

Save updated tasks in localStorage

🌓 Theme Handling

Adds or removes theme-dark class on <body>

Saves preference in localStorage

Restores theme on every page load