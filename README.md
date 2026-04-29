# AI Talking Companion

An interactive AI-powered web game inspired by Talking Tom, built with Next.js and ElevenLabs Conversational AI.

## Features
- **AI Voice Interaction**: Talk to the character and get real-time voice responses.
- **Dynamic Personality**: The AI's mood changes based on how you interact.
- **Gesture System**: Tap the character to "slap" them. Too many slaps will make them angry or sarcastic.
- **Roast Mode**: Toggle "Roast Mode" to make the AI extra spicy.
- **Smooth Animations**: Animated SVG character using Framer Motion.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **AI/Voice**: [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai)
- **Icons**: Lucide React

## Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- An ElevenLabs account.

### 2. Set up ElevenLabs Agent
1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai).
2. Create a new **Conversational Agent**.
3. Configure the **System Prompt** to handle `mood` and `slapCount` variables.
   - Example prompt: *Your name is Tom. You are a talking cat. You respond to the user based on your current mood: {{mood}} and the number of times you've been slapped: {{slapCount}}. If mood is roast, be funny and mean.*
4. Add **Dynamic Variables**: `mood` and `slapCount`.
5. Copy the **Agent ID**.
6. (Optional) Set the agent to **Public** if you don't want to use an API Key on the server.

### 3. Installation
```bash
npm install
```

### 4. Environment Variables
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
ELEVENLABS_API_KEY=your_api_key_here
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Connection Issues?
- **WebSocket Closed 1006 / RTC Errors**: This often happens with WebRTC handshakes. 
- **The Fix**: The app now supports **Signed URLs**. By providing an `ELEVENLABS_API_KEY` in `.env.local`, the app will automatically generate a secure session URL on the server, which is much more reliable than direct `agentId` connections.
- **Public vs Private**: If you don't use an API Key, ensure your agent is set to **Public** in the ElevenLabs dashboard.

## Interaction Guide
- **Talk**: Click the Microphone button and start speaking.
- **Slap**: Tap the character 3 times rapidly.
- **Roast**: Toggle the Roast Mode button for a different personality.
