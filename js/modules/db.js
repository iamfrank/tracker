// Module to interact with IndexedDB

import {openDB} from '../../dependencies/idb.js'

const dbName = 'iamfrankTrackerApp'
const dbVersion = 7
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
        db.createObjectStore(kpiTableName, { keyPath: 'name', unique: true })
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

async function getKPI(name) {
  const db = await initializeDB()
  const kpi = await db.get(kpiTableName, name)
  return kpi
}

async function delData(table, item) {
  const db = await initializeDB()
  await db.delete(table, item)
}

async function getData(table) {
  const db = await initializeDB()
  const allData = await db.getAll(table)
  return allData
}

/**
 * Add observation data to DB
 * @param {string} observation.kpid Corresponding KPI ID
 * @param {Date} observation.time Time of observation
 * @param {number} observation.rating Obervation rating value
 * @returns 
 */
async function addObservation(observation) {
  const db = await initializeDB()
  await db.add(observationTableName, observation)
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
