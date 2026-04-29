"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import Character from "@/components/Character";
import MicButton from "@/components/MicButton";
import { Flame, MessageCircle, Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mood, setMood] = useState<
    "happy" | "angry" | "sarcastic" | "roast" | "surprised" | "giggling"
  >("happy");
  const [slapCount, setSlapCount] = useState(0);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setErrorMsg(null);
    },
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message) => {
      console.log("Message from AI:", message);
      if (typeof message === "string") setLastMessage(message);
      else if (
        typeof message === "object" &&
        message !== null &&
        "message" in message
      ) {
        setLastMessage((message as { message: string }).message);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      setErrorMsg(
        typeof error === "string"
          ? error
          : "Connection failed. Check your Agent ID.",
      );
    },
  });

  const {
    status,
    startSession,
    endSession,
    isSpeaking,
    sendContextualUpdate,
    sendUserMessage,
  } = conversation;
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";
  const isTalking = isSpeaking;

  // Sync mood and slapCount with the agent mid-session via string context
  useEffect(() => {
    if (isConnected && sendContextualUpdate) {
      const updateMsg = `[Context Update] Mood: ${isRoastMode ? "roast" : mood}, Slaps: ${slapCount}.`;
      console.log("Sending contextual update:", updateMsg);
      sendContextualUpdate(updateMsg);
    }
  }, [mood, slapCount, isRoastMode, isConnected, sendContextualUpdate]);

  // Toggle Roast Mode
  const toggleRoastMode = () => {
    const nextRoastMode = !isRoastMode;
    setIsRoastMode(nextRoastMode);
    setMood(nextRoastMode ? "roast" : "happy");
  };

  // Handle Touch
  const handleTouch = useCallback(
    (part: string) => {
      let reactionPrompt = "";
      let newMood: typeof mood = "happy";

      switch (part) {
        case "head":
          reactionPrompt =
            "User just gently petted your head. Purr and say something short and cute.";
          newMood = "happy";
          break;
        case "belly":
          reactionPrompt =
            "User just poked your belly. Giggle and say something playfully annoyed.";
          newMood = "giggling";
          break;
        case "paw_left":
        case "paw_right":
          reactionPrompt =
            "User just touched your paw. Meow softly and say a short greeting.";
          newMood = "surprised";
          break;
        case "foot_left":
        case "foot_right":
          reactionPrompt =
            "User just tickled your foot. Laugh out loud and tell them to stop!";
          newMood = "giggling";
          break;
        default:
          reactionPrompt =
            "User just tapped you. Give a short, funny reaction.";
          newMood = "surprised";
      }

      if (isRoastMode) {
        reactionPrompt = `User just touched your ${part.replace("_", " ")}. Roast them with a short, funny insult!`;
        newMood = "roast";
      } else {
        setMood(newMood);
        // Reset mood after 3 seconds
        setTimeout(() => {
          setMood("happy");
        }, 3000);
      }

      if (isConnected && sendUserMessage) {
        sendUserMessage(reactionPrompt);
      }
    },
    [isRoastMode, isConnected, sendUserMessage],
  );

  // Handle Slap
  const handleSlap = useCallback(() => {
    // Procedural beep sound
    try {
      const ctx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Ignore audio context errors
    }

    setSlapCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 2 && !isRoastMode) {
        setIsRoastMode(true);
        setMood("roast");
      } else {
        setMood("angry");
      }
      return newCount;
    });

    if (isConnected && sendUserMessage) {
      sendUserMessage(
        "User just slapped you! Say 'Ouch!' or give a short, angry verbal reaction right now!",
      );
    }

    // Reset mood after 3 seconds if not in roast mode
    setTimeout(() => {
      setMood((current) => {
        if (current === "angry") return isRoastMode ? "roast" : "sarcastic";
        return current;
      });
    }, 3000);
  }, [isRoastMode, isConnected, sendUserMessage]);

  const toggleConversation = useCallback(async () => {
    if (isConnected) {
      await endSession();
    } else {
      setErrorMsg(null);
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

      if (!agentId) {
        setErrorMsg("Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID");
        return;
      }

      try {
        // Try to get a signed URL first
        const response = await fetch("/api/get-signed-url");
        const data = await response.json();

        const sessionConfig = {
          dynamicVariables: {
            mood: isRoastMode ? "roast" : mood,
            slapCount: slapCount.toString(),
          },
        };

        if (response.ok && data.signedUrl) {
          await startSession({
            signedUrl: data.signedUrl,
            ...sessionConfig,
          });
        } else {
          await startSession({
            agentId,
            ...sessionConfig,
          });
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
        setErrorMsg(
          "Connection failed. Ensure Agent is 'Public' or API Key is set.",
        );
      }
    }
  }, [isConnected, startSession, endSession, mood, slapCount, isRoastMode]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-slate-50 font-sans">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          AI Tom
        </h1>
        <button
          onClick={toggleRoastMode}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${
            isRoastMode
              ? "bg-orange-500 text-white shadow-lg"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Flame className={`w-4 h-4 ${isRoastMode ? "animate-pulse" : ""}`} />
          Roast Mode
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-md">
        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm border border-red-100"
          >
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </motion.div>
        )}

        {/* Chat Bubble */}
        <div className="h-24 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isTalking && lastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white px-6 py-3 rounded-2xl shadow-md border border-slate-100 text-slate-700 text-center font-medium max-w-xs relative"
              >
                {lastMessage}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Character */}
        <Character
          isTalking={isTalking}
          mood={mood}
          onTouch={handleTouch}
          onSlap={handleSlap}
        />

        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-sm font-medium text-slate-500">
            Mood: <span className="text-blue-600 capitalize">{mood}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 text-sm font-medium text-slate-500">
            Slaps: <span className="text-red-500">{slapCount}</span>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4">
        <MicButton
          isConnected={isConnected}
          isConnecting={isConnecting}
          onToggle={toggleConversation}
        />

        {!isConnected && (
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Make sure to allow microphone access
          </p>
        )}
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      </div>
    </main>
  );
}
