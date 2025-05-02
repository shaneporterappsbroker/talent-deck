import { client, GetUsersResponseData } from "../kantata/kantata.client";
import { translateUserData } from "../kantata/kantata.mappers";

const MIN_LENGTHS = {
  name: 4, // string
  email: 1, // array of strings
};

export const getUsersData = async ({
  token,
  searchQuery,
  by,
}: {
  token?: string | undefined;
  searchQuery: string;
  by: "name" | "email";
}) => {
  if (searchQuery.length < MIN_LENGTHS[by]) {
    return [];
  }

  const options = {
    params: {
      query: {
        on_my_account: true,
        // conditional query based on name or email:
        ...(by === "name"
          ? { by_full_name: searchQuery as string }
          : { by_email_addresses: searchQuery as string }),
        // only include the full details with the email search:
        ...(by === "email" && {
          include: "skills,skill_memberships,custom_field_values",
        }),
        per_page: 20,
      },
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const { data /*, response, error */ } = await client.GET("/users", options);

  return translateUserData(data as GetUsersResponseData);
};
