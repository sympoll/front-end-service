export function isAllVotingItemsDefined(votingItems: string[]): boolean {
    return votingItems.every(item => item !== "");
  }
  
  export function isTitleDefined(title: string): boolean {
    return title.trim() !== "";
  }
  
  export function isDeadlineValid(deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return false; // Invalid date
    }
  
    const now = new Date();
    return deadlineDate > now;
  }
  
  export function getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }