const timeline = document.getElementById("timeline");
const tabs = document.querySelectorAll(".tab");
const termSelect = document.getElementById("term");
const searchInput = document.getElementById("search");

let eventsData = events; // Use the events array from events.js
// let activeCategory = "All";
// let activeCategory = "Applications & Admissions";
// let activeCategory = "Registration & Enrollment";
let activeCategory = "Tuition & Payment";
let activeTerm = "All";
let searchTerm = "";

// Initialize the events display
renderEvents();

function renderEvents() {
  timeline.innerHTML = "";

  const filtered = eventsData.filter(event => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const matchesTerm = activeTerm === "All" || event.term === activeTerm;

    // Search by title or description (case-insensitive)
    const matchesSearch = searchTerm.trim() === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesTerm && matchesSearch;
  });

  if (filtered.length === 0) {
    timeline.innerHTML = "<p style='text-align:center;'>No events found.</p>";
    return;
  }

  filtered
    .sort((a, b) => {
      // Parse dates manually to avoid timezone issues
      const parseDate = (dateStr) => {
        const parts = dateStr.split('-');
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      };
      return parseDate(a.date) - parseDate(b.date);
    })
    .forEach(event => {
      const eventDiv = document.createElement("div");
      eventDiv.className = "event";

      // Fix timezone issue by parsing date manually
      const dateParts = event.date.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dateParts[2]);
      const localDate = new Date(year, month, day);

      // Debug: log the event to see what we're getting
      if (event.title === "Canada Day") {
        console.log("Canada Day event:", event);
        console.log("Original date string:", event.date);
        console.log("Parsed local date:", localDate);
        console.log("Formatted date:", localDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
      }

      eventDiv.innerHTML = `
        <h4>${localDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
        <div class="event-content">
          <div class="event-title">${event.title}</div>
          <div class="event-description">${event.description}</div>
        </div>
      `;
      timeline.appendChild(eventDiv);
    });
}

// Handle tab clicks
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    activeCategory = tab.dataset.category;
    renderEvents();
  });
});

// Handle term filter change
termSelect.addEventListener("change", () => {
  activeTerm = termSelect.value;
  renderEvents();
});

// Handle search input change (debounce to improve UX)
let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchTerm = searchInput.value;
    renderEvents();
  }, 300);
});
