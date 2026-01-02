import { useTypedQuery } from "../utils/genql-urql-bridge.ts";

export function WordReflesher() {
  const [wordsResult] = useTypedQuery({
    query: {
      words: {
        id: true,
        japanese: true,
        english: true,
      },
    },
  });

  return (
    <div>
      <h1>Word Reflesher</h1>
      <div>
        {wordsResult.data?.words?.map((word) => (
          <div key={word.id}>
            <h2>{word.japanese}</h2>
            <p>{word?.english?.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
