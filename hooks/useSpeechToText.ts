"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const getRecognition = () =>
  typeof window === "undefined" ? null : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Friendly messages for the errors the browser can send us
const ERRORS: Record<string, string> = {
  "not-allowed": "Microphone access is blocked. Allow it in your browser settings.",
  "service-not-allowed": "Microphone access is blocked. Allow it in your browser settings.",
  "audio-capture": "No microphone found. Please connect one.",
  network: "Speech recognition needs an internet connection.",
};

export function useSpeechToText(lang = "en-IN") {
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState(""); 
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState("");
  const recognitionRef = useRef<any>(null); // holds the browser's recogniser object
  const keepListening = useRef(false); // true while the user wants the mic on


  useEffect(() => {
    setSupported(!!getRecognition());
    return () => {
      keepListening.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  const start = useCallback(() => {
    const Recognition = getRecognition();
    if (!Recognition) return setSupported(false);

    const rec = new Recognition();
    rec.lang = lang;
    rec.continuous = true; 
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let finalText = "";
      let partialText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript; 
        if (event.results[i].isFinal) finalText += text + " ";
        else partialText += text;
      }
      if (finalText) setTranscript((old) => old + finalText);
      setInterim(partialText);
    };

    rec.onerror = (event: any) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      setError(ERRORS[event.error] ?? "Something went wrong with the microphone.");
      if (ERRORS[event.error]) keepListening.current = false;
    };

    
    rec.onend = () => {
      setInterim("");
      if (keepListening.current) {
        try { rec.start(); } catch {}
      } else {
        setListening(false);
      }
    };

    keepListening.current = true;
    recognitionRef.current = rec;
    setError("");
    try {
      rec.start();
      setListening(true);
    } catch {}
  }, [lang]);

  const stop = useCallback(() => {
    keepListening.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterim("");
  }, []);

  return { transcript, setTranscript, interim, listening, supported, error, start, stop, reset };
}