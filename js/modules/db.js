// Module to interact with IndexedDB

import {openDB} from '../../dependencies/idb.js'

const dbName = 'iamfrankTrackerApp'
const dbVersion = 11
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
        db.createObjectStore(observationTableName, { keyPath: 'time', unique: true })
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
  console.log('deleting', item)
  const db = await initializeDB()
  // If item is KPI, clean up observations related to it
  if (table === kpiTableName) {
    await delRelatedData(db, item)
    await db.delete(table, Number(item))
  } else {
    await db.delete(table, item)
  }
  return true
}

async function delRelatedData(database, item) {

  const tx = await database.transaction(observationTableName, 'readwrite')
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

async function getData(table, kpi = false) {
  if (!kpi) {

    // Returns all data in table
    const db = await initializeDB()
    const allData = await db.getAll(table)
    return allData

  } else {

    // Returns table objects filterede på kpi name
    const db = await initializeDB()
    const tx = await db.transaction(table, 'readonly')
    // Open a cursor on the designated object store:
    let cursor = await tx.store.openCursor()
    let filteredData = []
    while (cursor) {
      // Show the data in the row at the current cursor position:
      if (cursor.value.kpid === kpi) {
        filteredData.push(cursor.value)
      }
      // Advance the cursor to the next row:
      cursor = await cursor.continue()
    }
    return filteredData

  }
}

/**
 * Add observation data to DB
 * @param {number} observation.kpid Corresponding KPI ID
 * @param {Date} observation.time Time of observation
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
  addKPI,
  getKPI,
  addObservation,
  getObservation,
  delData,
  getData
}
