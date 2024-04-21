import { getKPI } from "./db.js"

export function zeroPrefix(n) {
  if (n < 10) {
    return `0${n}`
  } else {
    return n
  }
}

export function onElementRender(element, callbackFunc) {
  if (element.childNodes.length > 0) {
    callbackFunc()
  } else {
    setTimeout(function() {
      onElementRender(element, callbackFunc)
    }, 200)
  }
}

export function setKPIname() {
  document.querySelectorAll('a').forEach(function(navElement) {
    navElement.href = navElement.href += location.search
  })
  document.querySelector('.kpiname').innerText = new URLSearchParams(location.search).get('kpi')
}

export function localDate(dateObj) {
  return `${ dateObj.getUTCFullYear() }-${ zeroPrefix(dateObj.getMonth() +1) }-${ zeroPrefix(dateObj.getDate()) }`
}

export async function getLocalStorageKPI() {
  const kpid = Number(localStorage.getItem('kpid'))
  const kpi = await getKPI(kpid)
  return kpi
}