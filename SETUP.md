# Setup Guide for Developers

## Prerequisites

### Required Software
1. Node.js (v16 or higher)
2. npm or yarn package manager
3. Git
4. Code editor (VS Code recommended)
5. Supabase CLI (optional, for local development)

### Accounts Needed
1. GitHub account
2. Supabase account
3. OpenAI API account (for AI features)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/monkey-mind-task-manager.git
cd monkey-mind-task-manager
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the database migrations:
   ```bash
   supabase db reset
   ```
3. Set up the required tables and functions (see SQL scripts in repository)

### 5. Start Development Server
```bash
npm run dev
```

## Development Environment

### VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Configuration Files
1. `.eslintrc.js` - ESLint configuration
2. `tsconfig.json` - TypeScript configuration
3. `tailwind.config.js` - Tailwind CSS configuration
4. `vite.config.ts` - Vite configuration

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run with coverage
npm test:coverage
```

### Database Testing
1. Use Supabase local development
2. Run migrations on test database
3. Seed test data if needed

## Deployment

### Production Build
```bash
npm run build
```

### Deployment Platforms
1. Vercel
2. Netlify
3. Custom hosting

## Troubleshooting

### Common Issues
1. Node version mismatch
   - Solution: Use nvm to switch Node versions
2. Database connection issues
   - Check environment variables
   - Verify Supabase project settings
3. Build errors
   - Clear node_modules and reinstall
   - Check for TypeScript errors

### Getting Help
1. Check the GitHub issues
2. Join the developer Discord
3. Contact the maintainers

## Additional Resources
- [Supabase Documentation](https://supabase.io/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)