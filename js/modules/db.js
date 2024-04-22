// Module to interact with IndexedDB

import {openDB} from '../../dependencies/idb.js'

const dbName = 'iamfrankTrackerApp'
const dbVersion = 14
const kpiTableName = 'kpis'
const observationTableName = 'observations'

/** Function to initialize DB */ 
function initializeDB() {
  
  // Check for IndexedDB support
  if (!('indexedDB' in window)) {
    console.error("This browser does not support IndexedDB")
    return
  }

  // Opens a version of the database.
  // If the database does not exist, it will be created.
  return openDB(dbName, dbVersion, {
    upgrade (db) {
      // Creates store if none exist
      // Checks if the object store exists:
      if (!db.objectStoreNames.contains(kpiTableName)) {
        db.createObjectStore(kpiTableName, { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains(observationTableName)) {
        db.createObjectStore(observationTableName, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

/** 
 * Add KPI to DB
 * @param {string} kpi.name KPI human readable name
 * @param {string} kpi.color KPI indicating colour
 */
async function addKPI(kpi) {
  const db = await initializeDB()
  await db.add(kpiTableName, kpi)
}

async function getKPI(id) {
  const db = await initializeDB()
  const kpi = await db.get(kpiTableName, id)
  return kpi
}

async function delData(table, item) {
  const db = await initializeDB()
  await db.delete(table, item)
  return true
}

async function delKPIRelatedData(item) {

  const db = await initializeDB()
  const tx = await db.transaction(observationTableName, 'readwrite')
  let promises = []
  let cursor = await tx.store.openCursor()
  while (cursor) {
    if (cursor.value.kpid === item) {
      promises.push(tx.store.delete(cursor.key))
    }
    cursor = await cursor.continue()
  }

  await Promise.all([...promises, tx.done])
  return true
}

async function getKPIList() {
  const db = await initializeDB()
  const allData = await db.getAll(kpiTableName)
  return allData
}

async function getObservationList (kpi, getAll = false) {
  if (!getAll) {
    // Returns table objects filterede by kpi id
    const db = await initializeDB()
    const tx = await db.transaction(observationTableName, 'readonly')
    // Open a cursor on the designated object store:
    let cursor = await tx.store.openCursor()
    let filteredData = []
    while (cursor) {
      // Show the data in the row at the current cursor position:
      console.log('comparing', cursor.value.kpid, Number(kpi))
      if (cursor.value.kpid === Number(kpi)) {
        filteredData.push(cursor.value)
      }
      // Advance the cursor to the next row:
      cursor = await cursor.continue()
    }
    return filteredData
  } else {
    // Returns all data in table
    const db = await initializeDB()
    const allData = await db.getAll(observationTableName)
    return allData    
  }
}

/**
 * Add observation data to DB
 * @param {number} observation.kpid Corresponding KPI ID
 * @param {String} observation.time Time of observation in the format 'YYYY-MM-DD', ie. 2020-12-31
 * @param {number} observation.rating Obervation rating value
 * @returns 
 */
async function addObservation(observation) {
  const db = await initializeDB()
  const result = await db.add(observationTableName, observation)
  console.log(result)
  if (!result) {
    alert('You cannot enter more ratings for this indicator today.')
  }
}

async function getObservation(time) {
  const db = await initializeDB()
  const observation = await db.get(observationTableName, time)
  return observation
}

export {
  delData,

  addKPI,
  getKPI,
  getKPIList,

  addObservation,
  getObservation,
  delKPIRelatedData,
  getObservationList
}
