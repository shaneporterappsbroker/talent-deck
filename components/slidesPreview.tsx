import { GenerateSlidesResult } from "@/lib/google/workspace/workspace.client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function SlidesPreview({
  emails,
  onComplete,
}: {
  emails: string[];
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<GenerateSlidesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/presentations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emails }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error ?? "Failed to generate slides");
        }

        const data: GenerateSlidesResult = await res.json();
        setResponse(data);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
        onComplete();
      }
    };

    fetchSlides();
  }, [emails, onComplete]);

  if (loading) {
    return <Star className="animate-spin text-gray-500" size={30} />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm">
        <p className="font-medium">
          Something went wrong while generating your slides.
        </p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!response) {
    return null; // or some fallback message
  }

  return (
    <div className="rounded-xl shadow-md bg-white space-y-2">
      <div className="flex justify-start">
        <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl shadow-sm">
          <a
            href={response.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Open in Google Slides
          </a>
          <div className="mt-3">
            <iframe
              src={response.iframeSrc}
              width="400"
              height="300"
              allowFullScreen
              className="rounded-md shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
