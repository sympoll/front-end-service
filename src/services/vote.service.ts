import axios from "axios";

const voteServiceUrl = import.meta.env.VITE_VOTE_SERVICE_URL;

// TODO: once session mechanism is in place, replace this.
// const userId = import.meta.env.VITE_DEBUG_USER_ID;

// Helper function to handle API requests
async function sendVoteRequest(
  method: "post" | "delete",
  votingItemId: number,
  userId: string | undefined
): Promise<void> {
  const voteRequestPayload = {
    userId: userId,
    votingItemId: votingItemId
  };

  console.log(`${method.toUpperCase()} request on item: ${votingItemId}`);

  try {
    const response = await axios({
      method: method,
      url: voteServiceUrl,
      data: voteRequestPayload,
      withCredentials: true
    });

    return response.data;
  } catch (err) {
    console.error(
      `Error ${
        method === "post" ? "voting on" : "removing vote from"
      } item ${votingItemId}. Error info: ${err}`
    );
    throw err;
  }
}

// Function to vote on an item
export async function voteOnItem(votingItemId: number, userId: string | undefined): Promise<void> {
  return sendVoteRequest("post", votingItemId, userId);
}

// Function to remove vote from an item
export async function removeVoteFromItem(
  votingItemId: number,
  userId: string | undefined
): Promise<void> {
  return sendVoteRequest("delete", votingItemId, userId);
}
