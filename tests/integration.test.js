const { createDatabase } = require("../app/database");
const {
  registerAttendee,
  checkInAttendee,
  generateReport
} = require("../app/service");

let db;

beforeEach(() => {
  db = createDatabase();
  db.run("INSERT INTO events VALUES (1, 'Test Event', '2025-01-01')");
});

test("register attendee stored", async () => {
  await registerAttendee(db, 1, "Alice", "alice@test.com");

  db.get("SELECT * FROM attendees", (err, row) => {
    expect(row).toBeDefined();
  });
});

test("check-in updates status", async () => {
  await registerAttendee(db, 1, "Bob", "bob@test.com");
  await checkInAttendee(db, 1, "bob@test.com");

  db.get(
    "SELECT checked_in FROM attendees WHERE email='bob@test.com'",
    (err, row) => {
      expect(row.checked_in).toBe(1);
    }
  );
});

test("full workflow report", async () => {
  await registerAttendee(db, 1, "Carol", "carol@test.com");
  await checkInAttendee(db, 1, "carol@test.com");

  const report = await generateReport(db, 1);
  expect(report.checked_in).toBe(1);
});