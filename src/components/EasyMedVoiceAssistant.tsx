// EasyMed Voice Assistant — Integrated React Component (TypeScript + Tailwind)
// ================================================================
// What this file contains
// 1) A production-minded React component `EasyMedVoiceAssistant` that implements: 
//    - Browser microphone permission flow (STT)
//    - Azure Speech-to-Text (transcription) using short-lived tokens from your server
//    - Optional NLP callback (hook) where you can call your AI model (GPT / MedPaLM / custom) to produce a response
//    - Azure Text-to-Speech reply (TTS) in the user's language and chosen tone (normal/emergency)
//    - i18n integration (pulls localized responses from your translation files) and voice mapping
// 2) Example server implementations to issue short-lived Azure Speech tokens
//    - Express (Node.js) endpoint
//    - Firebase Function snippet
// 3) Security & deployment notes

// ----------------------------- USAGE -----------------------------
// - Copy this file into your React (Next.js) project as components/EasyMedVoiceAssistant.tsx
// - Implement a small server endpoint (example below) that returns { token, region }
// - Provide an `onNLP` prop if you want auto-NLP (e.g., call GPT) or leave it to return canned responses via i18n keys
// - Install dependencies:
//     npm i microsoft-cognitiveservices-speech-sdk react-icons

// ----------------------------- CODE -----------------------------
import React, { useEffect, useRef, useState } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { FiMic, FiPlay, FiPause, FiCheck } from 'react-icons/fi';
import i18n from '../i18n'; // adapt path to your i18n setup

// Voice map (same as earlier)
const VOICE_MAP: Record<string, { normal: string; emergency: string }> = {
  'en-IN': { normal: 'en-IN-NeerjaNeural', emergency: 'en-IN-PrabhatNeural' },
  'hi-IN': { normal: 'hi-IN-SwaraNeural', emergency: 'hi-IN-MadhurNeural' },
  'ta-IN': { normal: 'ta-IN-PadmaNeural', emergency: 'ta-IN-ValluvarNeural' },
  'te-IN': { normal: 'te-IN-SreeNeural', emergency: 'te-IN-ChaitanyaNeural' },
  'kn-IN': { normal: 'kn-IN-ManjulaNeural', emergency: 'kn-IN-GuruNeural' },
};

// Token endpoint (server) — should return { token, region }
const TOKEN_ENDPOINT = '/api/azure-tts-token';

// Utility
function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&"']/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}

// ---------------------- Component Props -------------------------
export type EasyMedVoiceAssistantProps = {
  // Optional: language code (falls back to i18n.language)
  lang?: string;
  // Optional: mode for tone (normal | emergency)
  mode?: 'normal' | 'emergency';
  // Optional: callback to run NLP / business logic. Receives the transcribed text and language.
  // Should return a string (text response) or an object { text, mode? }.
  onNLP?: (transcript: string, lang: string) => Promise<string | { text: string; mode?: 'normal' | 'emergency' }>;
  // Optional: decides whether to auto-play the TTS response
  autoPlay?: boolean;
};

export default function EasyMedVoiceAssistant({ lang, mode = 'normal', onNLP, autoPlay = true }: EasyMedVoiceAssistantProps) {
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const speechRecognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  const speechSynthRef = useRef<SpeechSDK.SpeechSynthesizer | null>(null);
  const langCode = lang || (i18n && i18n.language) || 'en-IN';

  // fetch token helper
  async function fetchToken() {
    const res = await fetch(TOKEN_ENDPOINT, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to fetch Azure token');
    return res.json(); // { token, region }
  }

  // init recognizer using a short-lived token
  async function initRecognizer(token: string, region: string) {
    if (speechRecognizerRef.current) {
      try { speechRecognizerRef.current.close(); } catch (e) {}
      speechRecognizerRef.current = null;
    }

    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
    // Speech to text language (use the langCode)
    speechConfig.speechRecognitionLanguage = langCode;

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    speechRecognizerRef.current = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
  }

  // init synthesizer
  async function initSynth(token: string, region: string, voiceName?: string) {
    if (speechSynthRef.current) {
      try { speechSynthRef.current.close(); } catch (e) {}
      speechSynthRef.current = null;
    }
    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
    if (voiceName) speechConfig.speechSynthesisVoiceName = voiceName;
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    speechSynthRef.current = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
  }

  // start listening
  async function startListening() {
    setStatus('Requesting access to microphone...');
    try {
      setLoading(true);
      const { token, region } = await fetchToken();
      await initRecognizer(token, region);
      if (!speechRecognizerRef.current) throw new Error('Recognizer init failed');

      setStatus('Listening...');
      setListening(true);

      speechRecognizerRef.current.recognizeOnceAsync(async (result) => {
        try {
          if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            const transcript = result.text || '';
            setMessage(transcript);
            setStatus('Transcription complete');

            // run NLP hook if provided
            let replyText: string | { text: string; mode?: any } = '';
            if (onNLP) {
              setStatus('Processing...');
              const out = await onNLP(transcript, langCode);
              replyText = out as any;
            } else {
              // fallback: use i18n canned responses
              // simple rule: if contains words for emergency, escalate
              const low = transcript.toLowerCase();
              if (/(chest pain|breath|blood|breathe|bleed|severe|unconscious)/i.test(low)) {
                replyText = { text: i18n.t('voice.emergency.reply', { lng: langCode }), mode: 'emergency' };
              } else {
                replyText = i18n.t('voice.normal.reply', { lng: langCode });
              }
            }

            // normalize reply
            let replyStr: string;
            let replyMode: 'normal' | 'emergency' = mode;
            if (typeof replyText === 'string') replyStr = replyText;
            else { replyStr = (replyText as any).text; if ((replyText as any).mode) replyMode = (replyText as any).mode; }

            // speak the reply
            await speakText(replyStr, replyMode);
          } else {
            setStatus('Could not recognize speech. Please try again.');
          }
        } catch (err) {
          console.error(err);
          setStatus('Error during processing');
        } finally {
          setListening(false);
          setLoading(false);
        }
      });
    } catch (err: any) {
      console.error(err);
      setStatus(err.message || 'Microphone access failed');
      setLoading(false);
      setListening(false);
    }
  }

  // speak text
  async function speakText(text: string, speakMode: 'normal' | 'emergency' = 'normal') {
    setStatus('Preparing reply...');
    setLoading(true);
    try {
      const voiceName = (VOICE_MAP[langCode] || VOICE_MAP['en-IN'])[speakMode];
      const { token, region } = await fetchToken();
      await initSynth(token, region, voiceName);
      if (!speechSynthRef.current) throw new Error('Synth init failed');

      const style = speakMode === 'normal' ? 'empathetic' : 'serious';
      const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="${langCode}">
          <voice name="${voiceName}">
            <mstts:express-as style="${style}" styledegree="2">
              <prosody rate="0%">${escapeXml(text)}</prosody>
            </mstts:express-as>
          </voice>
        </speak>`;

      await new Promise<void>((resolve, reject) => {
        speechSynthRef.current!.speakSsmlAsync(ssml, (result) => {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            setStatus('Spoken');
            resolve();
          } else {
            console.error('synthesis failed', result);
            reject(new Error('synthesis failed'));
          }
        }, (err) => { console.error(err); reject(err); });
      });

    } finally {
      setLoading(false);
    }
  }

  // cleanup
  useEffect(() => {
    return () => {
      try { speechRecognizerRef.current?.close(); } catch (e) {}
      try { speechSynthRef.current?.close(); } catch (e) {}
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full ${listening ? 'bg-red-100' : 'bg-indigo-50'}`}>
          <FiMic className={`w-6 h-6 ${listening ? 'text-red-600' : 'text-indigo-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{i18n.t('voice.title', { lng: langCode })}</h3>
          <p className="text-sm text-gray-600">{i18n.t('voice.subtitle', { lng: langCode })}</p>
        </div>
        <div>
          <button
            onClick={() => startListening()}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
            {loading ? 'Working...' : 'Talk to EasyMed'}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500">{i18n.t('voice.lastTranscript', { lng: langCode })}</div>
          <div className="mt-2 text-md text-gray-800 min-h-[44px]">{message || '—'}</div>
        </div>

        <div className="mt-3 flex gap-2">
          <div className="text-sm text-gray-500">{status}</div>
          {status === 'Spoken' && <FiCheck className="text-green-600 ml-2" />}
        </div>
      </div>
    </div>
  );
}

// ---------------------- Server Examples -------------------------
// 1) Express (Node.js) short-lived token endpoint
// ---------------------------------------------------------------
/*
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.post('/api/azure-tts-token', async (req, res) => {
  try {
    const AZURE_KEY = process.env.AZURE_SPEECH_KEY;
    const AZURE_REGION = process.env.AZURE_SPEECH_REGION; // e.g. southcentralus
    if (!AZURE_KEY || !AZURE_REGION) return res.status(500).json({ error: 'missing azure creds' });

    const tokenResp = await fetch(`https://${AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': AZURE_KEY }
    });
    if (!tokenResp.ok) {
      const txt = await tokenResp.text();
      console.error('token error', txt);
      return res.status(500).json({ error: 'token fetch failed' });
    }
    const token = await tokenResp.text();
    res.json({ token, region: AZURE_REGION });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});
app.listen(3000);
*/

// 2) Firebase Function (node) snippet
/*
const functions = require('firebase-functions');
const fetch = require('node-fetch');
exports.azureTtsToken = functions.https.onRequest(async (req, res) => {
  try {
    const AZURE_KEY = process.env.AZURE_SPEECH_KEY;
    const AZURE_REGION = process.env.AZURE_SPEECH_REGION;
    const tokenResp = await fetch(`https://${AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, { method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': AZURE_KEY } });
    const token = await tokenResp.text();
    res.json({ token, region: AZURE_REGION });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'token error' });
  }
});
*/

// ---------------------- Security Notes -------------------------
// - NEVER expose your Azure subscription key in client-side code.
// - The token endpoint fetches a short-lived token from Azure and returns it to the browser.
//   Tokens typically last ~10 minutes — good enough for user flows but short enough for security.
// - For production, consider rate-limiting and authenticating the token endpoint so only your frontend can call it.
// - If building for hospitals, consider on-prem deployment or private endpoints for compliance.

// ---------------------- i18n keys suggested ---------------------
/*
voice.title = "Talk to EasyMed"
voice.subtitle = "Ask about symptoms, medicines, or your health"
voice.lastTranscript = "Last transcript"
voice.normal.reply = "Your blood pressure is normal. Keep up your healthy habits."
voice.emergency.reply = "Your reading looks concerning. Please contact emergency services immediately."
*/

// ---------------------- Next Steps I can do for you ------------
// - Integrate a small GPT-based NLP function (secure server-side) and wire it to `onNLP`.
// - Add a pronunciation lexicon loader for medical terms.
// - Provide a lightweight UI with animation for listening/speaking states.
// - Deploy token endpoint on Vercel/Cloud Run / Firebase on request.
