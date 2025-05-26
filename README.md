# Wallet Survey Frames

A comprehensive wallet-connected survey platform with dual integration support: **Farcaster Frames** and **Embeddable JavaScript SDK**. Built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

### Core Functionality
- **Dual Platform Support**: Both Farcaster Frames v2 and embeddable web SDK
- **Wallet Integration**: MetaMask wallet connection and address capture
- **Multi-step Survey Flows**: Complex surveys with multiple question types
- **Response Analytics**: Complete response tracking and duplicate prevention
- **Professional UI**: Modern, responsive design with Tailwind CSS

### Question Types
- **Multiple Choice**: Single-select options
- **Rating Scale**: 5-star rating system
- **Text Input**: Open-ended responses
- **Required/Optional**: Flexible question configuration

### SDK Features
- **Multiple Triggers**: Scroll, time, exit-intent, manual triggers
- **Responsive Design**: Works on desktop and mobile
- **Event Callbacks**: Complete event system for integration
- **Duplicate Prevention**: Wallet-based response tracking
- **Easy Integration**: Single script tag implementation

## 📋 Project Structure

```
wallet-survey-frames/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── frame/
│   │   │   │   ├── route.ts              # Farcaster frame logic
│   │   │   │   └── image/
│   │   │   │       └── route.ts          # Dynamic frame images
│   │   │   ├── surveys/
│   │   │   │   └── route.ts              # Survey data API
│   │   │   └── embed/
│   │   │       ├── survey/[surveyId]/
│   │   │       │   └── route.ts          # Survey metadata
│   │   │       ├── submit/
│   │   │       │   └── route.ts          # Response submission
│   │   │       └── check-response/
│   │   │           └── route.ts          # Duplicate checking
│   │   ├── embed/[surveyId]/
│   │   │   └── page.tsx                  # Embedded survey UI
│   │   ├── demo/
│   │   │   └── page.tsx                  # SDK demo page
│   │   ├── globals.css                   # Global styles
│   │   ├── layout.tsx                    # Root layout
│   │   └── page.tsx                      # Landing page
│   ├── lib/
│   │   ├── database.ts                   # Database operations
│   │   └── frames.ts                     # Frame utilities
│   └── types.ts                          # TypeScript definitions
├── public/
│   └── sdk/
│       └── wallet-survey.js              # Embeddable SDK
├── data/
│   ├── surveys.json                      # Survey definitions
│   └── responses.json                    # Survey responses
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FRAME_URL=http://localhost:3000
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🎯 Usage Options

### Option 1: Farcaster Frames Integration

Share frame URLs directly in Farcaster casts for native social integration.

**Frame URL**: `http://localhost:3000/api/frame?surveyId=demo`

### Option 2: Embeddable JavaScript SDK

Integrate surveys into any website with a simple script tag.

```html
<!-- Include the SDK -->
<script src="http://localhost:3000/sdk/wallet-survey.js"></script>

<!-- Add survey triggers -->
<div data-wallet-survey="demo" data-trigger="scroll" data-trigger-value="50"></div>
<div data-wallet-survey="demo" data-trigger="time" data-trigger-value="10"></div>
<div data-wallet-survey="demo" data-trigger="exit-intent"></div>

<!-- Initialize -->
<script>
WalletSurvey.init({
  baseUrl: 'http://localhost:3000',
  onSurveyCompleted: (data) => console.log('Survey completed:', data),
  onSurveyError: (error) => console.log('Survey error:', error)
});
</script>
```

## 📊 API Endpoints

### Farcaster Frames
- `GET /api/frame` - Frame metadata and initial state
- `POST /api/frame` - Frame interactions and state transitions
- `GET /api/frame/image` - Dynamic frame image generation

### Embeddable SDK
- `GET /api/surveys` - All survey data
- `GET /api/embed/survey/[surveyId]` - Specific survey metadata
- `POST /api/embed/submit` - Submit survey responses
- `GET /api/embed/check-response` - Check for existing responses
- `GET /embed/[surveyId]` - Embedded survey UI

## 🔧 Survey Configuration

Surveys are defined in `data/surveys.json`:

```json
[
  {
    "id": "demo",
    "title": "Wallet Experience Survey",
    "description": "Help us improve wallet user experience",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "questions": [
      {
        "id": "satisfaction",
        "type": "rating",
        "question": "How satisfied are you with your current wallet?",
        "required": true
      },
      {
        "id": "features",
        "type": "multiple-choice",
        "question": "Which feature is most important to you?",
        "required": true,
        "options": ["Security", "Speed", "User Interface", "DeFi Integration"]
      },
      {
        "id": "feedback",
        "type": "text",
        "question": "Any additional feedback?",
        "required": false
      }
    ]
  }
]
```

## 🎮 SDK Trigger Types

### Scroll Trigger
```html
<div data-wallet-survey="demo" data-trigger="scroll" data-trigger-value="50"></div>
```
Triggers when user scrolls 50% down the page.

### Time Trigger
```html
<div data-wallet-survey="demo" data-trigger="time" data-trigger-value="10"></div>
```
Triggers after 10 seconds on the page.

### Exit Intent Trigger
```html
<div data-wallet-survey="demo" data-trigger="exit-intent"></div>
```
Triggers when user moves mouse toward browser close/back button.

### Manual Trigger
```html
<button onclick="WalletSurvey.triggerSurvey('demo')">Take Survey</button>
```
Triggers programmatically via JavaScript.

## 🔍 Testing & Demo

### SDK Demo Page
Visit `http://localhost:3000/demo` to see all SDK features in action:
- Live trigger examples
- Event logging
- Integration code samples
- Feature demonstrations

### Frame Testing
Use the [Farcaster Frame Validator](https://warpcast.com/~/developers/frames) to test frames:
1. Enter your frame URL: `http://localhost:3000/api/frame?surveyId=demo`
2. Test button interactions
3. Verify metadata and images

## 💾 Database Structure

### Surveys (`data/surveys.json`)
```typescript
interface Survey {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'rating' | 'text';
  question: string;
  required: boolean;
  options?: string[];
}
```

### Responses (`data/responses.json`)
```typescript
interface SurveyResponse {
  surveyId: string;
  walletAddress: string;
  responses: Record<string, string | number>;
  submittedAt: string;
  fid?: number; // For Farcaster frames
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_FRAME_URL=https://your-domain.vercel.app
   ```
4. Deploy

### Environment Variables
```env
NEXT_PUBLIC_FRAME_URL=https://your-domain.com  # Your deployed URL
```

## 🔧 Development Notes

### Key Components

1. **Database Layer** (`src/lib/database.ts`)
   - JSON file-based storage (easily replaceable)
   - Survey and response management
   - Duplicate prevention logic

2. **Frame Logic** (`src/app/api/frame/route.ts`)
   - Farcaster Frames v2 protocol implementation
   - State management for multi-step surveys
   - Image generation integration

3. **SDK** (`public/sdk/wallet-survey.js`)
   - Standalone JavaScript library
   - Multiple trigger type support
   - Iframe-based survey display
   - MetaMask integration

4. **Embedded UI** (`src/app/embed/[surveyId]/page.tsx`)
   - React-based survey interface
   - Wallet connection flow
   - Responsive design
   - Progress tracking

### Adding New Features

1. **New Question Types**:
   - Update `types.ts` with new question type
   - Add rendering logic in embedded UI
   - Update frame image generation
   - Add SDK support

2. **New Trigger Types**:
   - Extend SDK trigger detection
   - Add configuration options
   - Update demo page examples

3. **Database Integration**:
   - Replace JSON files in `src/lib/database.ts`
   - Maintain same interface for compatibility
   - Update environment variables

## 🛡️ Security Considerations

- **Input Validation**: All user inputs are sanitized
- **Wallet Verification**: MetaMask signature verification
- **Rate Limiting**: Implement for production use
- **CORS**: Configured for cross-origin requests
- **Frame Validation**: Farcaster request validation

## 📈 Analytics & Monitoring

Response data includes:
- Wallet addresses (primary key)
- Survey completion rates
- Question-level analytics
- Timestamp tracking
- Platform source (Frame vs SDK)

## 🔗 Integration Examples

### WordPress
```html
<!-- Add to theme footer -->
<script src="https://your-domain.com/sdk/wallet-survey.js"></script>
<div data-wallet-survey="feedback" data-trigger="exit-intent"></div>
<script>
WalletSurvey.init({ baseUrl: 'https://your-domain.com' });
</script>
```

### React/Next.js
```jsx
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://your-domain.com/sdk/wallet-survey.js';
  script.onload = () => {
    window.WalletSurvey.init({
      baseUrl: 'https://your-domain.com',
      onSurveyCompleted: handleSurveyComplete
    });
  };
  document.head.appendChild(script);
}, []);
```

### Shopify
```liquid
<!-- Add to theme.liquid -->
{{ 'https://your-domain.com/sdk/wallet-survey.js' | script_tag }}
<div data-wallet-survey="customer-feedback" data-trigger="scroll" data-trigger-value="80"></div>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test both Frame and SDK functionality
4. Update documentation
5. Submit a pull request

## 📄 License

MIT License - Open source and free to use.

## 🔗 Resources

- [Farcaster Frames Documentation](https://docs.farcaster.xyz/learn/what-is-farcaster/frames)
- [MetaMask Integration Guide](https://docs.metamask.io/guide/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built for the decentralized web** 🌐 | **Wallet-first surveys** 💼 | **Multi-platform ready** 🚀
