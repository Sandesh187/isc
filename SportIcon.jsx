function SportIcon({ sport }) {
  const icons = {
    Aquatics: (
      <>
        <path d="M10 38c4-4 8-4 12 0s8 4 12 0 8-4 12 0 8 4 12 0" />
        <path d="M22 22c4-4 10-4 14 0" />
        <path d="M32 15v10" />
      </>
    ),
    Athletics: (
      <>
        <path d="M12 38c6-10 14-16 24-18 8-2 14 0 20 4" />
        <path d="M18 44c8-8 16-12 24-14 8-2 14-1 18 2" />
        <path d="M40 16a4 4 0 1 1 0 8a4 4 0 0 1 0-8Z" />
      </>
    ),
    Badminton: (
      <>
        <path d="M20 18l22 22" />
        <path d="M18 20l8-8" />
        <path d="M42 42l8-8" />
        <path d="M42 18l10 10" />
      </>
    ),
    Basketball: (
      <>
        <circle cx="36" cy="30" r="16" />
        <path d="M20 30h32" />
        <path d="M36 14c4 4 6 10 6 16s-2 12-6 16" />
        <path d="M36 14c-4 4-6 10-6 16s2 12 6 16" />
      </>
    ),
    Cricket: (
      <>
        <path d="M24 42l16-24" />
        <path d="M40 18l6 4" />
        <circle cx="50" cy="20" r="5" />
      </>
    ),
    "Field Games": (
      <>
        <rect x="16" y="18" width="40" height="24" rx="6" />
        <path d="M36 18v24" />
        <path d="M16 30h40" />
      </>
    ),
    Football: (
      <>
        <circle cx="36" cy="30" r="16" />
        <path d="M36 22l6 4-2 8h-8l-2-8 6-4Z" />
      </>
    ),
    "Lawn Tennis": (
      <>
        <circle cx="30" cy="28" r="12" />
        <path d="M42 40l10 10" />
        <path d="M23 19c4 3 10 3 14 0" />
        <path d="M18 28h24" />
      </>
    ),
    Squash: (
      <>
        <path d="M20 42l18-20" />
        <path d="M38 22l8 8" />
        <circle cx="48" cy="18" r="4" />
      </>
    ),
    "Table Tennis": (
      <>
        <path d="M16 22h24l8 8H24Z" />
        <path d="M30 30v14" />
        <circle cx="50" cy="22" r="4" />
      </>
    ),
    Volleyball: (
      <>
        <circle cx="36" cy="30" r="16" />
        <path d="M28 16c8 4 12 12 12 20" />
        <path d="M44 20c-6 6-8 14-6 24" />
        <path d="M20 28c8-2 16 0 24 6" />
      </>
    ),
  };

  return (
    <div className="sport-icon" aria-hidden="true">
      <svg viewBox="0 0 72 60" role="img">
        <g>{icons[sport] ?? icons["Field Games"]}</g>
      </svg>
    </div>
  );
}

export default SportIcon;
