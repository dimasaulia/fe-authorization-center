/**
 * Menu type used internally by the app for rendering.
 * Maps from the authorization server's MenuEntry format.
 */
export type AppMenuItem = {
  label: string;
  href: string;
  permission: string;
  code: string;
};
