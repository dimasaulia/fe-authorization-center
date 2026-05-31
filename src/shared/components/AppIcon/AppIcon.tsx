export type AppIconName =
  | "apps"
  | "box"
  | "briefcase"
  | "calculator"
  | "close"
  | "dashboard"
  | "document"
  | "folder"
  | "key"
  | "logout"
  | "mail"
  | "menu"
  | "package"
  | "people"
  | "roles"
  | "search"
  | "settings"
  | "shield"
  | "user"
  | "wifi"
  | "zap";

type AppIconProps = {
  className?: string;
  name: AppIconName;
};

const paths: Record<AppIconName, React.ReactNode> = {
  apps: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
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
  close: (
    <>
      <path d="M7 7L17 17" />
      <path d="M17 7L7 17" />
    </>
  ),
  dashboard: (
    <>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H10V11H4V5.5Z" />
      <path d="M4 13H10V20H5.5C4.7 20 4 19.3 4 18.5V13Z" />
      <path d="M12 4H18.5C19.3 4 20 4.7 20 5.5V9H12V4Z" />
      <path d="M12 11H20V18.5C20 19.3 19.3 20 18.5 20H12V11Z" />
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
  key: (
    <>
      <circle cx="15" cy="9" r="4" />
      <path d="M12 12L5 19M5 19L7.5 19M5 19L5 16.5" />
      <path d="M9 15L7 17" />
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
  roles: (
    <>
      <path d="M12 4L14.5 9H19.5L15.5 12.5L17 18L12 15L7 18L8.5 12.5L4.5 9H9.5L12 4Z" />
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
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 4V6M12 18V20M4 12H6M18 12H20M6.35 6.35L7.75 7.75M16.25 16.25L17.65 17.65M17.65 6.35L16.25 7.75M7.75 16.25L6.35 17.65" />
      <circle cx="12" cy="12" r="6" />
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
  zap: (
    <>
      <path d="M13 2L4.5 13H12L11 22L19.5 11H12L13 2Z" />
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
