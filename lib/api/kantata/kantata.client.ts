import { paths } from "@/lib/api/kantata/kantata.types";
import createClient from "openapi-fetch";

const client = createClient<paths>({
  baseUrl:
    // use the full URL in server-side code, otherwise proxy via the Next.js API
    typeof window === "undefined"
      ? process.env.KANTATA_API_BASE_URL
      : "/api/kantata/proxy",
});

export { client };

export type GetUsersResponseSchema = paths["/users"]["get"]["responses"]["200"];
export type GetUsersResponseData = GetUsersResponseSchema["schema"];
