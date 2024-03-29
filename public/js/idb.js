console.log("Indexdb is working!")
let db;
const request = indexedDB.open("budget-tracker", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  // creates objectStore for this database
  db.createObjectStore("transactions", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Database error " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");

  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["transactions"], "readwrite");
          const store = transaction.objectStore("transactions");
          store.clear();
        });
    }
  };
}
window.addEventListener("online", checkDatabase);
