function isValidEmail(email) {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
}

function registerAttendee(db, eventId, name, email) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email");
  }

  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM attendees WHERE email=? AND event_id=?",
      [email, eventId],
      (err, row) => {
        if (row) {
          return reject(new Error("Already registered"));
        }

        db.run(
          "INSERT INTO attendees VALUES (?, ?, ?, ?)",
          [email, name, eventId, 0],
          resolve
        );
      }
    );
  });
}

function checkInAttendee(db, eventId, email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM attendees WHERE email=? AND event_id=?",
      [email, eventId],
      (err, row) => {
        if (!row) {
          return reject(new Error("Not registered"));
        }

        db.run(
          "UPDATE attendees SET checked_in=1 WHERE email=? AND event_id=?",
          [email, eventId],
          resolve
        );
      }
    );
  });
}

function generateReport(db, eventId) {
  return new Promise((resolve) => {
    db.get(
      "SELECT name FROM events WHERE id=?",
      [eventId],
      (err, event) => {
        db.all(
          "SELECT * FROM attendees WHERE event_id=?",
          [eventId],
          (err, attendees) => {
            const checkedIn = attendees.filter(a => a.checked_in === 1);

            resolve({
              event: event.name,
              registered: attendees.length,
              checked_in: checkedIn.length,
              attendees: checkedIn.map(a => a.name)
            });
          }
        );
      }
    );
  });
}

module.exports = {
  isValidEmail,
  registerAttendee,
  checkInAttendee,
  generateReport
};