import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import GymkhanaMark from "./GymkhanaMark";
import SportIcon from "./SportIcon";
import {
  facilityData,
  getToday,
  initialRegistrations,
  officialLinks,
  statusTone,
} from "./data";

const limitedSlots = new Set([
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "08:00 PM",
]);

const journeySteps = [
  {
    label: "Discover",
    title: "Pick a sport first",
    text: "Start with badminton, football, tennis, aquatics, or any other IITB sport.",
  },
  {
    label: "Choose",
    title: "See only relevant facilities",
    text: "Once a sport is selected, the page narrows down to matching courts and grounds.",
  },
  {
    label: "Register",
    title: "Lock your preferred slot",
    text: "Choose a timing, fill in your IITB details, and save your registration quickly.",
  },
];

function App() {
  const sports = useMemo(
    () => [...new Set(facilityData.map((facility) => facility.sport))],
    [],
  );
  const [selectedSport, setSelectedSport] = useState(sports[0]);
  const [selectedSetting, setSelectedSetting] = useState("All");
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const deferredSport = useDeferredValue(selectedSport);
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    email: "",
    players: "1",
    facilityId: facilityData[0].id,
    time: facilityData[0].slots[0],
  });

  const filteredFacilities = useMemo(
    () =>
      facilityData.filter((facility) => {
        const matchSport = facility.sport === deferredSport;
        const matchSetting =
          selectedSetting === "All"
            ? true
            : facility.setting.includes(selectedSetting);

        return matchSport && matchSetting;
      }),
    [deferredSport, selectedSetting],
  );

  const selectedFacility =
    facilityData.find((facility) => facility.id === form.facilityId) ?? facilityData[0];
  const firstOfficialLink = officialLinks[0];
  const secondOfficialLink = officialLinks[1];

  useEffect(() => {
    const currentVisible = filteredFacilities.some(
      (facility) => facility.id === form.facilityId,
    );

    if (!currentVisible && filteredFacilities[0]) {
      setForm((current) => ({
        ...current,
        facilityId: filteredFacilities[0].id,
        time: filteredFacilities[0].slots[0],
      }));
    }
  }, [filteredFacilities, form.facilityId]);

  const stats = useMemo(
    () => ({
      sports: new Set(facilityData.map((facility) => facility.sport)).size,
      indoorCount: facilityData.filter((facility) =>
        facility.setting.includes("Indoor"),
      ).length,
      outdoorCount: facilityData.filter((facility) =>
        facility.setting.includes("Outdoor"),
      ).length,
      visibleCount: filteredFacilities.length,
    }),
    [filteredFacilities.length],
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFacilityChange = (event) => {
    const nextFacilityId = event.target.value;
    const nextFacility =
      facilityData.find((facility) => facility.id === nextFacilityId) ?? facilityData[0];

    setForm((current) => ({
      ...current,
      facilityId: nextFacilityId,
      time: nextFacility.slots[0],
    }));
  };

  const handleSlotPick = (facilityId, time) => {
    setForm((current) => ({ ...current, facilityId, time }));
  };

  const handleRegistration = (event) => {
    event.preventDefault();

    const facility = facilityData.find((item) => item.id === form.facilityId);
    if (!facility) {
      return;
    }

    setRegistrations((current) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        facilityName: facility.name,
        sport: facility.sport,
        date: selectedDate,
        time: form.time,
        status: "registered",
      },
      ...current,
    ]);

    setForm((current) => ({
      ...current,
      name: "",
      rollNo: "",
      email: "",
      players: "1",
    }));
  };

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <header className="hero">
        <nav className="topbar">
          <div className="brand-lockup">
            <GymkhanaMark />
            <div>
              <p className="eyebrow">IIT Bombay sports booking concept</p>
              <h1>Gymkhana IIT Bombay</h1>
            </div>
          </div>

          <div className="topbar-links">
            <a href={firstOfficialLink.href} target="_blank" rel="noreferrer">
              Official portal
            </a>
            <a href={secondOfficialLink.href} target="_blank" rel="noreferrer">
              Court status
            </a>
          </div>
        </nav>

        <div className="hero-grid">
          <section className="hero-copy panel glass">
            <p className="kicker">Student-facing sports portal</p>
            <h2>Book the right IITB sports space in a few quick taps.</h2>
            <p className="hero-text">
              Inspired by a cleaner sports-booking experience, this version keeps
              the flow simple: choose a sport, browse the matching IITB facilities,
              and register for a slot without digging through a long queue.
            </p>

            <div className="hero-actions">
              <a
                className="primary-link-button"
                href={firstOfficialLink.href}
                target="_blank"
                rel="noreferrer"
              >
                Open Gymkhana portal
              </a>
              <a
                className="secondary-link-button"
                href={secondOfficialLink.href}
                target="_blank"
                rel="noreferrer"
              >
                Check live court status
              </a>
            </div>

            <div className="hero-stats">
              <article>
                <strong>{stats.sports}</strong>
                <span>sports</span>
              </article>
              <article>
                <strong>{stats.indoorCount}</strong>
                <span>indoor spaces</span>
              </article>
              <article>
                <strong>{stats.outdoorCount}</strong>
                <span>outdoor spaces</span>
              </article>
            </div>

            <div className="filter-row">
              <label>
                Facility type
                <select
                  value={selectedSetting}
                  onChange={(event) =>
                    startTransition(() => setSelectedSetting(event.target.value))
                  }
                >
                  <option value="All">Indoor and outdoor</option>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                </select>
              </label>

              <div className="selected-sport-card">
                <span>Selected sport</span>
                <strong>{selectedSport}</strong>
                <small>{stats.visibleCount} matching facilities ready to browse</small>
              </div>
            </div>
          </section>

          <aside className="panel spotlight quick-view">
            <div className="quick-view-head">
              <span>Quick view</span>
              <strong>{selectedSport}</strong>
              <small>Browse the currently selected sport at IITB Gymkhana</small>
            </div>

            <div className="quick-view-card">
              <label>Selected facility</label>
              <h3>{selectedFacility.name}</h3>
              <p>{selectedFacility.location}</p>
            </div>

            <div className="quick-view-grid">
              <article>
                <span>Slots today</span>
                <strong>{selectedFacility.slots.length}</strong>
              </article>
              <article>
                <span>Setting</span>
                <strong>{selectedFacility.setting}</strong>
              </article>
            </div>

            <div className="quick-slot-list">
              {selectedFacility.slots.map((slot) => (
                <button
                  key={`hero-${slot}`}
                  type="button"
                  className={`quick-slot ${form.time === slot ? "quick-slot-active" : ""}`}
                  onClick={() => handleSlotPick(selectedFacility.id, slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </aside>
        </div>

        <section className="journey-strip">
          {journeySteps.map((step) => (
            <article key={step.title} className="journey-card">
              <span>{step.label}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </article>
          ))}
        </section>
      </header>

      <main className="content-grid">
        <section className="panel section-block section-wide">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Choose your sport</p>
              <h3>Start with the game you want to play</h3>
            </div>
          </div>

          <div className="sport-selector">
            {sports.map((sport) => (
              <button
                key={sport}
                type="button"
                className={`sport-option ${selectedSport === sport ? "sport-option-active" : ""}`}
                onClick={() => startTransition(() => setSelectedSport(sport))}
              >
                <SportIcon sport={sport} />
                <span>Sport</span>
                <strong>{sport}</strong>
                <small>
                  {facilityData.filter((facility) => facility.sport === sport).length} facility
                  {facilityData.filter((facility) => facility.sport === sport).length > 1 ? "ies" : "y"}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel section-block section-wide">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Campus facilities</p>
              <h3>{selectedSport} facilities at IITB Gymkhana</h3>
            </div>
            <div className="metric-pills">
              <span>{filteredFacilities.length} facilities visible</span>
              <span>{selectedSetting === "All" ? "Indoor and outdoor" : selectedSetting}</span>
            </div>
          </div>

          <div
            key={`${deferredSport}-${selectedSetting}`}
            className="venue-grid venue-grid-animated"
          >
            {filteredFacilities.map((facility) => (
              <article key={facility.id} className="venue-card">
                <div className="venue-header">
                  <div>
                    <p className="sport-chip">{facility.sport}</p>
                    <h4>{facility.name}</h4>
                    <p>{facility.location}</p>
                  </div>
                </div>

                <div className="facility-meta">
                  <span>{facility.setting}</span>
                  <span>{facility.type}</span>
                  <span>{facility.count}</span>
                </div>

                <p className="surface-copy">{facility.note}</p>

                <div className="feature-list">
                  {facility.features.map((feature) => (
                    <span key={feature}>{feature}</span>
                  ))}
                </div>

                <div className="slot-row">
                  {facility.slots.map((slot) => (
                    <button
                      key={`${facility.id}-${slot}`}
                      type="button"
                      className={`slot-pill ${
                        limitedSlots.has(slot) ? "slot-limited" : ""
                      } ${
                        form.facilityId === facility.id && form.time === slot
                          ? "slot-active"
                          : ""
                      }`}
                      onClick={() => handleSlotPick(facility.id, slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="facility-footer">
                  <span>{facility.timings}</span>
                  <span>{facility.access}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel section-block booking-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Registration</p>
              <h3>Register your preferred slot early</h3>
            </div>
            <p className="section-note">
              Keep this simple and student-focused with a quick slot request flow.
            </p>
          </div>

          <form className="booking-form" onSubmit={handleRegistration}>
            <label>
              Full name
              <input
                required
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleFormChange}
              />
            </label>

            <label>
              Roll number
              <input
                required
                type="text"
                name="rollNo"
                placeholder="eg. 24B1234"
                value={form.rollNo}
                onChange={handleFormChange}
              />
            </label>

            <label>
              IITB email
              <input
                required
                type="email"
                name="email"
                placeholder="name@iitb.ac.in"
                value={form.email}
                onChange={handleFormChange}
              />
            </label>

            <label>
              Facility
                <select
                  name="facilityId"
                  value={form.facilityId}
                  onChange={handleFacilityChange}
                >
                  {filteredFacilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} / {facility.sport}
                    </option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>

            <label>
              Preferred slot
              <select name="time" value={form.time} onChange={handleFormChange}>
                {selectedFacility.slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Number of players
              <select name="players" value={form.players} onChange={handleFormChange}>
                <option value="1">1 player</option>
                <option value="2">2 players</option>
                <option value="4">4 players</option>
                <option value="8">Team / group</option>
              </select>
            </label>

            <div className="booking-summary">
              <span>{selectedFacility.name}</span>
              <strong>
                {selectedDate} / {form.time}
              </strong>
            </div>

            <button className="primary-button" type="submit">
              Register slot
            </button>
          </form>
        </section>

        <section className="panel section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your registrations</p>
              <h3>Keep track of the slots you claimed</h3>
            </div>
            <div className="status-summary">
              <span className="status-registered">
                {registrations.filter((item) => item.status === "registered").length} registered
              </span>
              <span className="status-waitlist">
                {registrations.filter((item) => item.status === "waitlist").length} waitlist
              </span>
            </div>
          </div>

          <div className="booking-list">
            {registrations.map((registration) => (
              <article key={registration.id} className="booking-card">
                <div>
                  <h4>{registration.name}</h4>
                  <p>
                    {registration.facilityName} / {registration.sport}
                  </p>
                </div>

                <div className="booking-meta">
                  <span>{registration.date}</span>
                  <span>{registration.time}</span>
                  <strong className={statusTone[registration.status]}>
                    {registration.status}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
