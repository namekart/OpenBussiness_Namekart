/**
 * Navigation tool: returns a structured action for the frontend to navigate.
 * No side effects; the API layer sends this in the response.
 */
export function createNavigationAction(page: string): { type: "navigate"; page: string } {
  const normalized = page.startsWith("/") ? page : `/${page}`;
  return { type: "navigate", page: normalized };
}
