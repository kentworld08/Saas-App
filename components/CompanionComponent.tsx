"use client";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundWaves from "@/constants/soundwaves.json";
import { addToSessionHistory } from "@/lib/actions/companion.actions";

enum callStatusProps {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  style,
  voice,
  userImage,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<callStatusProps>(
    callStatusProps.INACTIVE
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [message, setMessage] = useState<SavedMessage[]>([]);
  const [isMuted, setisMuted] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);
  useEffect(() => {
    const onCallStart = () => setCallStatus(callStatusProps.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(callStatusProps.FINISHED);
      addToSessionHistory(companionId);
    };
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessage((prev) => [newMessage, ...prev]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("Error", error);
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, [companionId]);

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setisMuted(!isMuted);
  };
  const handleDisconnect = () => {
    setCallStatus(callStatusProps.FINISHED);
    vapi.stop();
  };
  const handleCall = async () => {
    setCallStatus(callStatusProps.CONNECTING);
    const assistantOverrides = {
      VariableValues: {
        subject,
        topic,
        style,
      },
      clientMessages: ["transcript"],
      severMessages: [],
    };
    // @ts-expect-error: configureAssistant has a type mismatch due to dynamic overrides
    vapi.start(configureAssistant((voice, style), assistantOverrides));
  };

  return (
    <section className="flex flex-col h-fit">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === callStatusProps.FINISHED ||
                  callStatus === callStatusProps.INACTIVE
                  ? "opacity-100"
                  : "opacity-0",
                callStatus === callStatusProps.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>
            <div
              className={cn(
                `absolute transition-opacity duration-1000`,
                callStatus === callStatusProps.ACTIVE
                  ? "opacity-100"
                  : "opacity-0"
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundWaves}
                autoplay={false}
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
        </div>
        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName ?? ""}
              width={130}
              height={130}
              className="rounded-lg"
            />
          </div>
          <p className="font-bold text-2xl">{userName}</p>
          <button
            className="btn-mic"
            type="button"
            onClick={toggleMicrophone}
            disabled={callStatus !== callStatusProps.ACTIVE}
          >
            <Image
              src={isMuted ? `/icons/mic-off.svg` : `/icons/mic-on.svg`}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>
          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === callStatusProps.ACTIVE
                ? "bg-red-700"
                : "bg-primary",
              callStatus === callStatusProps.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === callStatusProps.ACTIVE
                ? handleDisconnect
                : handleCall
            }
          >
            {callStatus === callStatusProps.ACTIVE
              ? "End Session"
              : callStatus === callStatusProps.CONNECTING
              ? "Connecting"
              : "Start Session"}
          </button>
        </div>
      </section>
      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {message.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replaceAll("/[.,]", "")}:{message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName}:{message.content}
                </p>
              );
            }
          })}
        </div>
        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default CompanionComponent;
