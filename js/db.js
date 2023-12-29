// Module to interact with the DB (indexedDB)

// Define a function to initialize IndexedDB
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TrackerApp', 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const objectStore = db.createObjectStore('daylies', { keyPath: 'day' })
      // You can add more fields as needed
      objectStore.createIndex('mood', 'mood', { unique: false })
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Add data to IndexedDB
function addData(dailymood) {
  return initializeDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('daylies', 'readwrite')
      const objectStore = transaction.objectStore('daylies')
      const request = objectStore.add(dailymood)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })
}

// Retrieve data from IndexedDB
function getData() {
  return initializeDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('daylies', 'readonly')
      const objectStore = transaction.objectStore('daylies')
      const request = objectStore.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    });
  });
}

export {
  getData,
  addData
}
