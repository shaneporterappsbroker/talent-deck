import { paths } from "@/lib/api/kantata/kantata.types";
import createClient from "openapi-fetch";

const client = createClient<paths>({
  baseUrl: "/api/kantata/proxy",
});

export { client };
export type GetUsersResponseSchema = paths["/users"]["get"]["responses"]["200"];
export type GetUsersResponseData = GetUsersResponseSchema["schema"];
