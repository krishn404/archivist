import { useMutation, useQuery } from "@tanstack/react-query";
import { env } from "@quarter/env/web";

const API_URL = env.NEXT_PUBLIC_SERVER_URL;

export type UpdateUserNameResponse = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

// API endpoints

const getApiHealth = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/health`);
  if (!response.ok) {
    throw new Error("Failed to fetch API health");
  }
  return response.json();
};

async function updateUserNameRequest(
  name: string
): Promise<UpdateUserNameResponse> {
  const response = await fetch(`${API_URL}/api/users/update-name`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Failed to update name");
  }

  return response.json();
}

/**
 * Mutation hooks
 */

export function useGetApiHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: getApiHealth,
  });
}

export function useUpdateUserName() {
  return useMutation({
    mutationFn: updateUserNameRequest,
  });
}
