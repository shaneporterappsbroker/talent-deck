import { GenerateSlidesResult } from "@/lib/google/workspace/workspace.client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function SlidesPreview({ emails }: { emails: string[] }) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<GenerateSlidesResult | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/presentations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emails }),
        });

        const data: GenerateSlidesResult = await res.json();
        setResponse(data);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
        setResponse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [emails]);

  return (
    <>
      {loading && !response && (
        <Star className="animate-spin text-gray-500 bg-transparent" size={30} />
      )}
      <div className="rounded-xl shadow-md bg-white space-y-2">
        {response && (
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
        )}
      </div>
    </>
  );
}
