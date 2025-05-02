"use client";

import { useEffect, useRef, useState } from "react";
import {
  processDataAndGenerateSlides,
  ProcessDataResult,
} from "@/app/actions/generateSlides";
import { Star } from "lucide-react";
import { SlidesError } from "./slidesError";
import { CapturedInfo } from "@/lib/api/models/types";

export function SlidesPreview({
  projectDetails,
  onComplete,
}: {
  projectDetails: CapturedInfo;
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [slidesResult, setSlidesResult] = useState<ProcessDataResult | null>(
    null,
  );
  const hasFetched = useRef(false); // Prevent double-fetch in dev

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchSlides = async () => {
      try {
        const result = await processDataAndGenerateSlides({
          projectDetails,
        });

        setSlidesResult(result);

        setLoading(false);
        onComplete();
      } catch (err) {
        console.error("Failed to generate slides:", err);
        setSlidesResult({
          data: null,
          error: {
            message: "Failed to generate slides.",
            stack: err instanceof Error ? err.stack : undefined,
          },
        });
      } finally {
        setLoading(false);
        onComplete();
      }
    };

    fetchSlides();
  }, [projectDetails, onComplete]);

  if (loading) {
    return <Star className="animate-spin text-gray-500" size={30} />;
  }

  if (!slidesResult) {
    return null;
  }

  if (slidesResult?.error) {
    return <SlidesError error={slidesResult.error} />;
  }

  return (
    <div className="rounded-xl shadow-md bg-white space-y-2">
      <div className="flex justify-start">
        <div className="bg-gray-100 text-gray-900 p-4 rounded-2xl shadow-sm">
          <a
            href={slidesResult.data?.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Open in Google Slides
          </a>
          <div className="mt-3">
            <iframe
              src={slidesResult.data?.iframeSrc}
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
