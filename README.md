# IdeaStick
> "Share ideas. Find teammates. Build together."

## Overview
IdeaStick is a collaborative web platform designed for teams and individuals to brainstorm, manage, and refine project concepts seamlessly. Whether you're posting concepts publicly to find new collaborators, organizing your personal sandbox securely, or actively discussing private concepts within a synchronized team environment, IdeaStick provides the structural foundation to turn your raw thoughts into finished products.

## Features

### 🌍 Public Idea Board
* Post ideas publicly to showcase your vision
* Discover inspiring ideas from other users
* Connect and find potential collaborators

### 👤 Personal Boards
* A private sandbox to safely track your own ideas
* View and manage ideas you created away from the public eye
* Monitor the progress and lifecycle of your concepts

### 👥 Team Collaboration
* Create new teams or gracefully join existing ones
* Utilize private team idea boards isolated from the public network
* Easily invite members to collaborate securely

### 💬 Idea Discussion
* Dedicated comment threads natively attached to each idea
* Collaborate, debate, and iterate heavily before making decisions

### 🗳️ Decision System
* Community-driven voting to surface the best ideas
* Built-in administrative controls allowing team leaders to easily accept or reject ideas

## Tech Stack
* **Frontend:** React + Tailwind CSS
* **Backend:** Supabase (Auth, Database, Realtime)
* **Animations:** Motion (Framer Motion)
* **Icons:** Lucide React

## Project Structure
* `/src/components` - Core reusable UI elements (Modals, Sticky Notes, Navigation)
* `/src/components/views` - Application page views (Dashboard, My Boards, Team Boards, Settings)
* `/src/contexts` - Global application state (AuthContext, BoardContext)
* `/src/lib` - Utility configurations (Supabase client)
* `/src/types` - TypeScript interfaces mapping to the Database schema

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ideastick.git
   cd ideastick
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

## Mock Login
The application supports a rapid "Guest Mode" for testing layout and components. If you do not have backend credentials configured yet, this allows for a quick preview without requiring formal authentication setup or database connection.

## Future Improvements
* Real-time chat system
* Notifications
* AI-based idea suggestions
* File sharing

## Contributing
* Fork the repo
* Create a feature branch (`git checkout -b feature/AmazingFeature`)
* Commit your changes (`git commit -m 'Add some AmazingFeature'`)
* Push to the branch (`git push origin feature/AmazingFeature`)
* Submit a pull request

## License
Distributed under the MIT License.

## Author
* **Dakshesh Verma**
* [GitHub Profile](https://github.com/yourusername)
