function GymkhanaMark() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 120 120" role="img">
        <circle cx="60" cy="60" r="54" className="logo-ring" />
        <circle cx="60" cy="60" r="39" className="logo-core" />
        <path
          className="logo-track"
          d="M33 77c9-17 18-25 27-25 7 0 13 5 18 14 4-13 13-22 27-29"
        />
        <text x="60" y="67" textAnchor="middle">
          IITB
        </text>
      </svg>
    </div>
  );
}

export default GymkhanaMark;
