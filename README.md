# PrinceTech AI - VS Code Setup Guide

एक modern AI-powered search और discovery platform जो React, TypeScript, और Express के साथ बनाया गया है।

## VS Code में Setup करने के लिए Steps

### 1. Project Clone करें
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Dependencies Install करें
```bash
npm install
```

### 3. Environment Variables Setup करें

`.env.example` file को copy करके `.env` file बनाएं:
```bash
cp .env.example .env
```

`.env` file में अपनी Gemini API key add करें:
```env
NODE_ENV=development
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
HOST=localhost
```

### 4. Gemini API Key कैसे प्राप्त करें

1. [Google AI Studio](https://aistudio.google.com/app/apikey) पर जाएं
2. Google account से sign in करें  
3. "Create API Key" button पर click करें
4. API key copy करके `.env` file में paste करें

### 5. Database Setup करें

```bash
# Database schema push करें
npm run db:push
```

### 6. VS Code में Run करें

#### Option 1: Terminal से
```bash
npm run dev
```

#### Option 2: VS Code Debugger से
1. VS Code में project open करें
2. `F5` press करें या Run and Debug panel से "Start Development Server" select करें
3. Browser में `http://localhost:5000` open करें

### 7. Available Scripts

```bash
npm run dev          # Development server start करें
npm run dev:debug    # Debug mode के साथ server start करें  
npm run build        # Production build बनाएं
npm run start        # Production server start करें
npm run db:push      # Database schema push करें
npm run db:studio    # Database management UI खोलें
```

## VS Code Extensions (Recommended)

ये extensions automatically suggest होंगी जब आप project open करेंगे:

- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - CSS autocomplete
- **TypeScript** - TypeScript support
- **Auto Rename Tag** - HTML tag renaming
- **Path Intellisense** - File path autocomplete
- **ESLint** - Code linting

## Project Structure

```
├── client/              # React frontend
│   ├── src/            
│   │   ├── components/ # UI components
│   │   ├── pages/      # Route pages
│   │   ├── hooks/      # Custom hooks
│   │   └── lib/        # Utilities
├── server/             # Express backend
│   ├── index.js        # Server entry point
│   ├── routes.js       # API routes
│   ├── storage.js      # Database operations
│   └── openai.js       # Gemini AI integration
├── shared/             # Shared code
│   └── schema.js       # Database schema
├── .vscode/            # VS Code configuration
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Troubleshooting

### Database Connection Issues
```bash
npm run db:push --force
```

### Port Already in Use
`.env` file में PORT change करें:
```env
PORT=3000
```

### Gemini API Not Working
- API key correct check करें
- Google AI Studio में quota check करें
- Internet connection verify करें

## Development Workflow

1. **Code Changes**: VS Code में files edit करें
2. **Auto Reload**: Server automatically restart होगा
3. **Debugging**: F5 press करके breakpoints set करें
4. **Database Changes**: Schema update के बाद `npm run db:push` run करें

Happy Coding! 🚀