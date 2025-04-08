import { client, GetUsersResponseData } from "../kantata/kantata.client";
import { translateUserData } from "../kantata/kantata.mappers";

export const getUsersData = async ({
  searchQuery = "",
}: {
  searchQuery?: string;
} = {}) => {
  if (searchQuery.length < 4) {
    return [];
  }

  const { data /*, response, error*/ } = await client.GET("/users", {
    params: {
      query: {
        on_my_account: true,
        by_full_name: searchQuery,
        include: "skills,skill_memberships,custom_field_values",
        per_page: 20,
      },
    },
  });

  return translateUserData(data as GetUsersResponseData);
};
