export type AppIconName =
  | "box"
  | "briefcase"
  | "calculator"
  | "document"
  | "folder"
  | "logout"
  | "mail"
  | "menu"
  | "package"
  | "people"
  | "search"
  | "settings"
  | "shield"
  | "user"
  | "wifi";

type AppIconProps = {
  className?: string;
  name: AppIconName;
};

const paths: Record<AppIconName, React.ReactNode> = {
  box: (
    <>
      <path d="M12 4L19 7.5V16.5L12 20L5 16.5V7.5L12 4Z" />
      <path d="M5.5 8L12 11.5L18.5 8M12 11.5V19" />
    </>
  ),
  briefcase: (
    <>
      <path d="M9 7V5.8C9 4.8 9.8 4 10.8 4H13.2C14.2 4 15 4.8 15 5.8V7" />
      <path d="M5 8.5C5 7.7 5.7 7 6.5 7H17.5C18.3 7 19 7.7 19 8.5V17.5C19 18.3 18.3 19 17.5 19H6.5C5.7 19 5 18.3 5 17.5V8.5Z" />
      <path d="M5 12H19M10 12V13.5H14V12" />
    </>
  ),
  calculator: (
    <>
      <path d="M7 4.5H17C17.8 4.5 18.5 5.2 18.5 6V18C18.5 18.8 17.8 19.5 17 19.5H7C6.2 19.5 5.5 18.8 5.5 18V6C5.5 5.2 6.2 4.5 7 4.5Z" />
      <path d="M8.5 8H15.5M8.5 12H9M12 12H13M15.5 12H15.6M8.5 15.5H9M12 15.5H13M15.5 15.5H15.6" />
    </>
  ),
  document: (
    <>
      <path d="M6 5.5C6 4.7 6.7 4 7.5 4H13L18 9V18.5C18 19.3 17.3 20 16.5 20H7.5C6.7 20 6 19.3 6 18.5V5.5Z" />
      <path d="M13 4V9H18M9 13H15M9 16H13" />
    </>
  ),
  folder: (
    <>
      <path d="M5 6.7C5 5.8 5.8 5 6.7 5H11L13.2 7.2H17.3C18.2 7.2 19 8 19 8.9V17.3C19 18.2 18.2 19 17.3 19H6.7C5.8 19 5 18.2 5 17.3V6.7Z" />
      <path d="M8 12H16M8 15H13" />
    </>
  ),
  logout: (
    <>
      <path d="M10 6H7.5C6.1 6 5 7.1 5 8.5V15.5C5 16.9 6.1 18 7.5 18H10" />
      <path d="M14 8L18 12L14 16M18 12H10" />
    </>
  ),
  mail: (
    <>
      <path d="M4 7.5L11.1 12.25C11.65 12.62 12.35 12.62 12.9 12.25L20 7.5" />
      <path d="M5.5 5.5H18.5C19.3 5.5 20 6.2 20 7V17C20 17.8 19.3 18.5 18.5 18.5H5.5C4.7 18.5 4 17.8 4 17V7C4 6.2 4.7 5.5 5.5 5.5Z" />
    </>
  ),
  menu: (
    <>
      <path d="M7 8H17M7 12H17M7 16H13" />
      <path d="M4.5 4.5H19.5V19.5H4.5V4.5Z" />
    </>
  ),
  package: (
    <>
      <path d="M12 4L19 7.5V16.5L12 20L5 16.5V7.5L12 4Z" />
      <path d="M5.5 8L12 11.5L18.5 8" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M4.5 18C5.4 15.3 6.9 14 9 14C11.1 14 12.6 15.3 13.5 18" />
      <path d="M15 11C16.7 11 18 9.7 18 8C18 6.3 16.7 5 15 5M16 14C17.8 14.4 18.9 15.8 19.5 18" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="M15 15L19 19" />
    </>
  ),
  settings: (
    <>
      <path d="M12 8.5C13.9 8.5 15.5 10.1 15.5 12C15.5 13.9 13.9 15.5 12 15.5C10.1 15.5 8.5 13.9 8.5 12C8.5 10.1 10.1 8.5 12 8.5Z" />
      <path d="M19.4 13.5L21 14.75L19.25 17.78L17.36 17.02L16.1 17.76L15.82 19.75H12.32L12.04 17.76L10.75 17.01L8.88 17.78L7.12 14.75L8.72 13.5V12.5L7.12 11.25L8.88 8.22L10.75 8.99L12.04 8.24L12.32 6.25H15.82L16.1 8.24L17.36 8.98L19.25 8.22L21 11.25L19.4 12.5V13.5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M8.5 11.5L11 14L16 9" />
      <path d="M12 3.75L19 7V12.2C19 16.3 16.15 19.25 12 20.25C7.85 19.25 5 16.3 5 12.2V7L12 3.75Z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 20C6.6 16.9 8.7 15.5 12 15.5C15.3 15.5 17.4 16.9 18.5 20" />
    </>
  ),
  wifi: (
    <>
      <path d="M5 10C9.5 6.5 14.5 6.5 19 10" />
      <path d="M8 13C10.6 11 13.4 11 16 13" />
      <path d="M11.5 16.5H12.5" />
    </>
  ),
};

export function AppIcon({ className = "h-5 w-5", name }: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {paths[name]}
      </g>
    </svg>
  );
}
