import { useState } from "react";
import { useTypedMutation, useTypedQuery } from "../utils/genql-urql-bridge.ts";
import { enumLearningType } from "../generated/genql/schema.ts";
import { useAuth } from "../context/AuthContext.tsx";

export function WordReflesher() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLastCard, setIsLastCard] = useState(false);

  const { user } = useAuth();

  const speakEnglish = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    globalThis.speechSynthesis.cancel();
    globalThis.speechSynthesis.speak(utterance);
  };

  const [wordsResult] = useTypedQuery({
    query: {
      words: {
        id: true,
        japanese: true,
        english: true,
        difficulty: true,
        frequency: true,
        situation: true,
      },
    },
  });

  const [_createLearningHistoryResult, createLearningHistory] =
    useTypedMutation({
      mutation: {
        createLearningHistory: {
          __args: {
            learningType: enumLearningType.passiveLearning,
            userId: "", // placeholder - 実行時に上書き
            wordId: "", // placeholder - 実行時に上書き
          },
          id: true,
          learningType: true,
          userId: true,
          wordId: true,
        },
      },
    });

  const sampleWords = wordsResult.data?.words ?? [];
  const currentWord = sampleWords[currentIndex];

  const handleNext = () => {
    console.log(currentIndex + 1);
    if (sampleWords[currentIndex] && user?.id) {
      createLearningHistory({
        learningType: enumLearningType.passiveLearning,
        userId: user?.id,
        wordId: currentWord.id,
      });
    }

    if (currentIndex < sampleWords.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsLastCard(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLastCard(false);
      setCurrentIndex(0);
      setIsAnimating(false);
    }, 300);
  };

  if (isLastCard && isAnimating === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl p-16 text-center rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="space-y-8">
            <div className="text-8xl animate-in zoom-in delay-100">🎉</div>
            <h1 className="text-5xl font-bold text-balance text-gray-900">
              完了しました
            </h1>
            <p className="text-xl text-gray-600">
              全{sampleWords.length}枚のカードを確認しました
            </p>
            <button
              type="button"
              onClick={handleRestart}
              className="h-14 px-8 text-lg rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              最初から
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress indicator */}
        <div className="text-center space-y-4 animate-in fade-in duration-300">
          <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {currentIndex + 1}
          </div>
          <div className="flex justify-center gap-2">
            {sampleWords.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? "w-12 bg-gradient-to-r from-purple-600 to-pink-600"
                    : index < currentIndex
                    ? "w-2 bg-purple-400"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main card */}
        <div
          className={`p-16 rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
            isAnimating
              ? "animate-out fade-out zoom-out-95 opacity-0"
              : "animate-in fade-in zoom-in-95"
          }`}
        >
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <div className="text-8xl md:text-9xl font-bold text-foreground animate-in fade-in zoom-in duration-500">
                {currentWord?.japanese}
              </div>
              <div className="flex items-center justify-center gap-4 animate-in fade-in delay-100">
                <button
                  type="button"
                  onClick={() => speakEnglish(currentWord?.english?.[0] ?? "")}
                  className="p-3 rounded-full hover:bg-purple-100 transition-colors duration-200 group"
                  aria-label="音声を再生"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600 group-hover:text-purple-700 transition-colors"
                  >
                    <path d="M11 5 6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                </button>
                <div className="text-2xl text-muted-foreground">
                  {currentWord?.english?.join(", ")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center animate-in fade-in delay-200">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">難易度</div>
                <div className="font-medium capitalize">
                  {currentWord?.difficulty}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">シーン</div>
                <div className="font-medium capitalize">
                  {currentWord?.situation}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full h-16 text-xl rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in delay-300"
            >
              次へ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
