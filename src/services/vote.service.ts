import axios from "axios";

const voteServiceUrl =
  import.meta.env.VITE_VOTE_SERVICE_URL;

// TODO: once session mechanism is in place, replace this.
const userId = import.meta.env.VITE_DEBUG_USER_ID

// Helper function to handle API requests
async function sendVoteRequest(
  method: "post" | "delete",
  votingItemId: number
): Promise<void> {
  const voteRequestPayload = {
    userId: userId,
    votingItemId: votingItemId,
  };

  console.log(`${method.toUpperCase()} request on item: ${votingItemId}`);

  try {
    const response = await axios({
      method: method,
      url: voteServiceUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: voteRequestPayload,
      withCredentials: true,
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
export async function voteOnItem(votingItemId: number): Promise<void> {
  return sendVoteRequest("post", votingItemId);
}

// Function to remove vote from an item
export async function removeVoteFromItem(votingItemId: number): Promise<void> {
  return sendVoteRequest("delete", votingItemId);
}
