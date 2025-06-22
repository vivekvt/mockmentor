/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  MessageSquare,
  Phone,
  Clock,
  X,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { useMemoizedFn, useUnmount } from 'ahooks';
import {
  StreamingAvatarSessionState,
  useStreamingAvatarSession,
  useVoiceChat,
} from './logic';
import {
  AvatarQuality,
  ElevenLabsModel,
  StartAvatarRequest,
  StreamingEvents,
  STTProvider,
  VoiceChatTransport,
  VoiceEmotion,
} from '@heygen/streaming-avatar';
import LoadingSkeleton from './loading-skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { mentors } from './mentors';

async function fetchAccessToken() {
  try {
    const response = await fetch('/api/get-access-token', {
      method: 'POST',
    });
    const token = await response.text();

    return token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.High,
  avatarName: 'Judy_Teacher_Sitting_public',
  knowledgeId: undefined,
  voice: {
    rate: 2,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: 'en',
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

const Interview = ({
  knowledgeBase,
  role,
  mentorId,
}: {
  knowledgeBase: string;
  role: string;
  mentorId: string;
}) => {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config] = useState<StartAvatarRequest>({
    ...DEFAULT_CONFIG,
    knowledgeBase,
    avatarName: mentorId || DEFAULT_CONFIG?.avatarName,
  });

  const mediaStream = useRef<HTMLVideoElement>(null);

  const router = useRouter();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [exitLoading, setExitLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'interviewer',
      text: "Hello! Welcome to your mock interview. I'm excited to speak with you today.",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: 2,
      sender: 'user',
      text: "Thank you! I'm ready to begin.",
      timestamp: new Date(Date.now() - 240000),
    },
  ]);

  // Timer state
  const [startTime, setStartTime] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState(180); // 3 minutes in seconds

  const videoRef = useRef<any>(null);
  const chatScrollRef = useRef<any>(null);

  // Timer effect - countdown from 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (new Date().getTime() - startTime.getTime()) / 1000
      );
      const remaining = Math.max(0, 180 - elapsed); // 180 seconds = 3 minutes
      setRemainingTime(remaining);

      // Auto-exit when time is up
      if (remaining === 0) {
        exitInterview();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Get user media
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: isMicOn })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.log('Error accessing media devices:', err));
    } else if (!isCameraOn && videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [isCameraOn, isMicOn]);

  useEffect(() => {
    console.log('Session state changed:');
    startSessionV2(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log('Avatar started talking', e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log('Avatar stopped talking', e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log('Stream disconnected');
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log('>>>>> Stream ready:', event.detail);
        setLoading(false);
        setStartTime(new Date());
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log('>>>>> User started talking:', event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log('>>>>> User stopped talking:', event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log('>>>>> User end message:', event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log('>>>>> User talking message:', event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log('>>>>> Avatar talking message:', event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log('>>>>> Avatar end message:', event);
      });

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error('Error starting avatar session:', error);
    }
  });

  useUnmount(() => {
    // Stop all media tracks (camera/microphone)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop());
      videoRef.current.srcObject = null;
    }
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  // Function to get mentor name by ID
  const getMentorName = (id: string) => {
    const mentor = mentors.find(
      (mentor) => mentor.id === id || mentor.id.trim() === id.trim()
    );
    return mentor ? mentor.name : 'AI Interviewer';
  };

  const mentorName = getMentorName(mentorId);

  //

  const formatTime = (seconds: any) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate interviewer response
      setTimeout(() => {
        const responses = [
          "That's a great point. Can you elaborate on that?",
          'Interesting perspective. How would you handle a challenging situation?',
          'Thank you for sharing. What would you say is your greatest strength?',
          'I appreciate your honesty. Can you give me a specific example?',
          "That's valuable experience. How do you see yourself growing in this role?",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            sender: 'interviewer',
            text: randomResponse,
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exitInterview = async () => {
    setExitLoading(true);

    // Stop all media tracks (camera/microphone)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track: any) => track.stop());
      videoRef.current.srcObject = null;
    }

    await stopAvatar();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col px-4">
      {loading && <LoadingSkeleton />}
      <div className="flex flex-row items-center gap-2 py-4">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
        </div>
        <h1 className="text-md font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
          {role || ''} Interview{' '}
        </h1>
        {!loading && (
          <Badge
            variant={remainingTime <= 30 ? 'destructive' : 'secondary'}
            className="flex items-center space-x-1 shrink-0"
          >
            <Clock className="w-3 h-3" />
            <span>{formatTime(remainingTime)}</span>
          </Badge>
        )}
      </div>
      {/* Main Content */}
      <div className="flex flex-1 max-w-7xl mx-auto">
        {/* Video Section */}
        <div
          className={`flex-1 transition-all duration-300 ${
            isChatOpen ? 'lg:pr-2' : ''
          }`}
        >
          <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 no-h-[calc(100vh-140px)]">
            {/* Interviewer Video */}
            <div className="relative overflow-hidden rounded-lg border">
              <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-sm font-medium">
                  {mentorName}
                </span>
              </div>
              <div className="relative h-full bg-muted">
                {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
                  <video
                    playsInline
                    ref={mediaStream}
                    autoPlay
                    className="w-full h-full object-cover"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarFallback className="text-lg">AI</AvatarFallback>
                      </Avatar>
                      <p className="text-muted-foreground">
                        AI Interviewer joining soon...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Video */}
            <div className="relative overflow-hidden rounded-lg border">
              <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                <span className="text-white text-sm font-medium">You</span>
              </div>
              <div className="relative h-full bg-muted">
                {isCameraOn ? (
                  <video
                    playsInline
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  >
                    <track kind="captions" />
                  </video>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div
          className={`flex flex-col pl-2 transition-all duration-300 ${
            isChatOpen ? 'w-full lg:w-96 bg-muted lg:bg-background' : 'w-0'
          } ${
            isChatOpen
              ? 'fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto'
              : 'hidden'
          }`}
        >
          <div className="bg-muted/30 h-full flex flex-col rounded-none lg:rounded-lg lg:border">
            <div className="flex items-center justify-between py-2 px-3 border-b">
              <div className="text-lg flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Interview Chat</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-col flex-1 pt-2">
              {/* Messages */}
              <ScrollArea
                className="px-4 flex flex-1 flex-col"
                ref={chatScrollRef}
              >
                <div className="space-y-4 pb-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          msg.sender === 'user' ? 'order-2' : 'order-1'
                        }`}
                      >
                        <div
                          className={`border rounded-lg px-3 py-2 text-sm ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {/* Message Input */}
              <div className="border-t p-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Controls */}
      <div className="py-4 flex justify-center space-x-4">
        {/* <Button
          onClick={() => {
            startSessionV2(true);
          }}
        >
          Start
        </Button> */}
        <Button
          variant={isCameraOn ? 'default' : 'secondary'}
          size="icon"
          onClick={() => setIsCameraOn(!isCameraOn)}
          className="rounded-full"
        >
          {isCameraOn ? <Camera /> : <CameraOff />}
        </Button>
        <Button
          variant={isMicOn ? 'default' : 'secondary'}
          size="icon"
          onClick={() => setIsMicOn(!isMicOn)}
          className="rounded-full"
        >
          {isMicOn ? <Mic /> : <MicOff />}
        </Button>
        {/* <Button
          variant={isChatOpen ? 'default' : 'secondary'}
          size="icon"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="rounded-full"
        >
          <MessageSquare />
        </Button> */}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              // onClick={exitInterview}
              className="rounded-full"
            >
              <Phone />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to exit the Interview?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={exitLoading} onClick={exitInterview}>
                Exit Interview
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Interview;
