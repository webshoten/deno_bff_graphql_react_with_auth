import { useEffect, useRef, useState } from "react";
import { useTypedMutation, useTypedQuery } from "../utils/genql-urql-bridge.ts";
import { enumLearningType } from "../generated/genql/schema.ts";
import { useAuth } from "../context/AuthContext.tsx";

// 経験値アニメーション用カスタムフック
function useAnimatedNumber(targetValue: number, duration: number = 500) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(targetValue);

  useEffect(() => {
    if (targetValue === prevValueRef.current) return;

    const startValue = prevValueRef.current;
    const diff = targetValue - startValue;
    const startTime = performance.now();
    setIsAnimating(true);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数（easeOutExpo）
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.round(startValue + diff * easeProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevValueRef.current = targetValue;
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return { displayValue, isAnimating };
}

export function WordReflesher() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLastCard, setIsLastCard] = useState(false);
  const [expGainEffect, setExpGainEffect] = useState(false);
  const [gainedExp, setGainedExp] = useState(0);

  const { user } = useAuth();

  const speakEnglish = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    globalThis.speechSynthesis.cancel();
    globalThis.speechSynthesis.speak(utterance);
  };

  const [wordsResult, reexecuteQuery] = useTypedQuery({
    query: {
      wordsForStudy: {
        __args: {
          userId: user?.id ?? "",
          limit: 12,
        },
        id: true,
        japanese: true,
        english: true,
        difficulty: true,
        frequency: true,
        situation: true,
      },
    },
    pause: !user?.id, // ユーザーがログインするまでクエリを実行しない
  });

  // 経験値（学習履歴数）を取得
  const [expResult, reexecuteExpQuery] = useTypedQuery({
    query: {
      learningHistoryCount: {
        __args: {
          userId: user?.id ?? "",
        },
      },
    },
    pause: !user?.id,
  });

  const EXP_PER_LEARNING = 10;
  const totalExp = (expResult.data?.learningHistoryCount ?? 0) *
    EXP_PER_LEARNING;
  const { displayValue: animatedExp, isAnimating: isExpAnimating } =
    useAnimatedNumber(totalExp, 800);

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

  const sampleWords = wordsResult.data?.wordsForStudy ?? [];
  const currentWord = sampleWords[currentIndex];

  const handleNext = async () => {
    console.log(currentIndex + 1);
    if (sampleWords[currentIndex] && user?.id) {
      await createLearningHistory({
        learningType: enumLearningType.passiveLearning,
        userId: user?.id,
        wordId: currentWord.id,
      });

      // 経験値獲得エフェクト
      setGainedExp(EXP_PER_LEARNING);
      setExpGainEffect(true);
      setTimeout(() => setExpGainEffect(false), 1000);

      // 経験値を再取得
      reexecuteExpQuery({ requestPolicy: "network-only" });
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
      // 新しい12件を取得（キャッシュを無視してサーバーから再取得）
      reexecuteQuery({ requestPolicy: "network-only" });
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

            {/* 獲得EXP表示 */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg animate-in zoom-in delay-200">
              <span className="text-3xl">⚡</span>
              <div className="text-left">
                <div className="text-xs text-amber-100 font-medium">
                  TOTAL EXP
                </div>
                <div className="text-3xl font-bold text-white tabular-nums">
                  {animatedExp.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 最初からボタン */}
            <div className="pt-4">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* パーティクルアニメーション用CSS */}
      <style>
        {`
        @keyframes particle-0 { to { transform: translate(-30px, -40px); opacity: 0; } }
        @keyframes particle-1 { to { transform: translate(30px, -35px); opacity: 0; } }
        @keyframes particle-2 { to { transform: translate(-40px, -20px); opacity: 0; } }
        @keyframes particle-3 { to { transform: translate(40px, -25px); opacity: 0; } }
        @keyframes particle-4 { to { transform: translate(-20px, -50px); opacity: 0; } }
        @keyframes particle-5 { to { transform: translate(25px, -45px); opacity: 0; } }
        @keyframes exp-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.8); }
        }
      `}
      </style>
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress indicator with EXP */}
        <div className="animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            {/* Word番号 */}
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentIndex + 1}
            </div>

            {/* 経験値表示 */}
            <div className="relative">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg transition-all duration-300 ${
                  isExpAnimating ? "scale-110 shadow-amber-500/50" : ""
                }`}
              >
                <span className="text-2xl">⚡</span>
                <div className="text-right">
                  <div className="text-xs text-amber-100 font-medium tracking-wider">
                    EXP
                  </div>
                  <div
                    className={`text-2xl font-bold text-white tabular-nums ${
                      isExpAnimating ? "animate-pulse" : ""
                    }`}
                  >
                    {animatedExp.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 経験値獲得エフェクト */}
              {expGainEffect && (
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <div className="px-2 py-1 rounded-full bg-green-500 text-white text-sm font-bold shadow-lg animate-pulse">
                    +{gainedExp}
                  </div>
                </div>
              )}

              {/* パーティクルエフェクト */}
              {expGainEffect && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-amber-400"
                      style={{
                        left: "50%",
                        top: "50%",
                        animation: `particle-${i} 0.8s ease-out forwards`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* プログレスバー */}
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
