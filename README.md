# 🌙 Ramadan Mubarak Greeting Generator

A beautiful, interactive web application to create and share personalized Ramadan greetings with stunning animations, visual effects, and audio ambiance.

## ✨ Features

- **🎨 Interactive Greeting Creator**: Generate beautiful, personalized Ramadan greetings with your custom name
- **✉️ 10+ Pre-written Wishes**: Carefully curated messages and blessings for the holy month
- **⏳ Ramadan Countdown**: Real-time countdown timer showing days, hours, minutes, and seconds until Ramadan
- **🎉 Confetti Animation**: Celebratory confetti effects with every greeting generation
- **🎬 Smooth Animations**: Framer Motion-powered transitions and effects for a premium feel
- **3D Tilt Effect**: Interactive parallax tilt effect on greeting cards
- **🎵 Ambient Audio**: Optional Ramadan ambient music to enhance the experience
- **📸 Download Greeting**: Export your greeting as a high-quality image (PNG format)
- **📱 Share Functionality**: Easy sharing options for your personalized greetings
- **🎯 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⌨️ Real-time Updates**: Live preview as you customize your greeting

## 🛠 Tech Stack

- **React 19.2.4**: Modern UI library with latest features
- **Vite 6.2**: Lightning-fast build tool and development server
- **TypeScript 5.8**: Type-safe development experience
- **Framer Motion 12.34**: Advanced animation library
- **html-to-image**: Convert DOM elements to images
- **canvas-confetti**: Stunning confetti animation effects
- **react-parallax-tilt**: 3D tilt effect on greeting cards
- **Lucide React**: Beautiful, consistent icons

## 📁 Project Structure

```
ramadan-greeting-generator/
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Entry point
│   ├── types.ts             # TypeScript type definitions
│   ├── index.html           # HTML template
│   └── styles/              # Global styles (if separate)
├── public/
│   ├── favicon.svg          # App favicon
│   ├── moon.svg             # Moon icon/asset
│   └── ramadan-ambient.mp3  # Ambient background music
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ramadan-greeting-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 📝 Available Scripts

- **`npm run dev`** - Start the development server with hot reload
- **`npm run build`** - Build the app for production
- **`npm run preview`** - Preview the production build locally

## 💡 How It Works

### App States
The application has three main states:

1. **INTRO** - Welcome screen with Ramadan countdown timer
2. **INPUT** - User enters their name and selects a greeting wish
3. **RESULT** - Displays the personalized greeting with options to download or create another

### Greeting Generation Flow

1. View the countdown timer on the intro page
2. Click "Create Greeting" to enter your name
3. Select from 10+ pre-written Ramadan wishes
4. Preview your personalized greeting with animations and effects
5. Toggle ambient music on/off
6. Download the greeting as an image
7. Share with friends and family

## 🎨 Customization

### Modifying Wishes
Edit the `RAMADAN_WISHES` array in [App.tsx](App.tsx) to add or change greeting messages:

```typescript
const RAMADAN_WISHES = [
  "Your custom wish here",
  // Add more wishes...
];
```

### Adjusting Ramadan Date
The app is set to February 18, 2026. Update the `RAMADAN_START_DATE` constant:

```typescript
const RAMADAN_START_DATE = new Date('2026-02-18T00:00:00');
```

### Styling
The application uses Tailwind CSS (or your configured styling solution) for a responsive, beautiful design.

## 🎯 Features in Detail

### Text Animation
- Typing effect for custom greetings with blinking cursor
- Smooth text transitions between screens

### Visual Effects
- **Confetti**: Triggered when greeting is generated
- **Tilt Effect**: 3D parallax tilt on greeting cards
- **Framer Motion**: Smooth animations for all transitions

### Audio
- Ramadan ambient background music
- Play/pause controls for audio ambiance
- Auto-plays or user-controlled based on preferences

### Image Export
- High-quality PNG export of your greeting
- Uses html-to-image library for accurate rendering

## 📱 Responsive Design

The app is fully responsive and works on:
- 💻 Desktop computers
- 📱 Mobile phones
- 📱 Tablets
- Any device with a modern web browser

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

### Deploy to Netlify

1. Run `npm run build`
2. Go to [Netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder
4. Your app is live!

### Deploy to Other Platforms

Since it's a static Vite app, you can deploy to:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any static hosting service

## 🐛 Troubleshooting

### Audio not playing?
- Check browser permissions for audio playback
- Ensure `ramadan-ambient.mp3` is in the public folder
- Try muting and unmuting using the audio toggle

### Confetti not showing?
- Check browser console for JavaScript errors
- Ensure canvas-confetti library is properly installed

### Image export issues?
- Try a different browser (Chrome/Firefox generally work best)
- Check that the greeting card is fully rendered before exporting

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Framer Motion](https://www.framer.com/motion)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests with improvements

## 📄 License

This project is open source and available under the MIT License.

## 💝 Ramadan Wishes

May this blessed month bring peace, prosperity, and joy to you and your loved ones. Ramadan Kareem! 🌙✨

---

**Made with ❤️ for the blessed month of Ramadan**
