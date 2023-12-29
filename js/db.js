// Module to interact with IndexedDB

// Define a function to initialize DB
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MoodTrackerApp', 1)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      const objectStoreMoods = db.createObjectStore('registrations', { keyPath: 'day' })
      objectStoreMoods.createIndex('mood', 'mood', { unique: false })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Add data to DB
function addData(dailymood) {
  return initializeDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('registrations', 'readwrite')
      const objectStore = transaction.objectStore('registrations')
      const request = objectStore.put(dailymood)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  })
}

// Retrieve all data from DB
function getData() {
  return initializeDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('registrations', 'readonly')
      const objectStore = transaction.objectStore('registrations')
      const request = objectStore.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  })
}

export {
  getData,
  addData
}
