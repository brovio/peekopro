# Monkey Mind Task Manager

## Overview
Monkey Mind Task Manager is a sophisticated task management application designed to help users organize their thoughts, break down complex tasks, and manage their daily activities effectively. The application combines traditional task management with AI-powered task breakdown capabilities, making it ideal for professionals, project managers, and anyone looking to improve their productivity.

## Features

### 1. Task Management
- **Mind Dump**: Quickly capture thoughts and tasks without worrying about organization
- **Automatic Task Classification**: AI-powered categorization of tasks
- **Priority Management**: Special "#1 Priority" section for most important tasks
- **Task Categories**: Organize tasks into Work, Fitness, Habit, and Journal categories

### 2. Task Breakdown
- **AI-Powered Breakdown**: Break complex tasks into manageable subtasks
- **Guided Breakdown**: Interactive Q&A process for detailed task analysis
- **Quick Breakdown**: Instant task decomposition for simpler tasks

### 3. Note Taking
- **Color-coded Notes**: Create and organize notes with custom colors
- **Rich Text Support**: Add formatted text and descriptions
- **Export/Import**: Share and backup your notes

### 4. Journal Entries
- **Mood Tracking**: Record daily moods and emotions
- **Gratitude Journal**: Document things you're grateful for
- **Goal Setting**: Track personal and professional goals

## Pages and Features

### Flooko Page
The main task management interface where users can:
- Quickly input tasks (Mind Dump)
- View and manage task categories
- Access the "#1 Priority" section
- Break down complex tasks

### Notes Page
A dedicated space for note-taking where users can:
- Create color-coded notes
- Organize thoughts and ideas
- Export and import notes

### Journal Page
Personal journaling interface featuring:
- Daily mood tracking
- Gratitude journaling
- Goal setting and tracking

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account (for backend services)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd monkey-mind-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage Guide

### Getting Started
1. Sign up or log in to your account
2. Use the Mind Dump feature to quickly capture tasks
3. Let the AI categorize your tasks or manually assign categories
4. Use the breakdown feature for complex tasks

### Breaking Down Tasks
1. Select a task you want to break down
2. Choose between Quick Breakdown or Guided Breakdown
3. Follow the prompts to create detailed subtasks

### Managing Notes
1. Click the "+" button to create a new note
2. Choose a color for your note
3. Add title and description
4. Save and organize your notes

## Known Limitations
- Currently supports English language only
- Limited to text-based notes (no image attachments)
- Maximum of 100 tasks per category

## Future Development Plans
- Mobile application development
- Multi-language support
- Advanced task analytics
- Team collaboration features
- File attachment support

## Support and Contact
For support or contributions, please contact:
- Email: support@monkeymind.app
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.