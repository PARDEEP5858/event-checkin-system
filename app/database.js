const sqlite3 = require("sqlite3").verbose();

function createDatabase(dbName = ":memory:") {
  const db = new sqlite3.Database(dbName);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY,
        name TEXT,
        date TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS attendees (
        email TEXT,
        name TEXT,
        event_id INTEGER,
        checked_in INTEGER
      )
    `);
  });

  return db;
}

module.exports = { createDatabase };