export const  timeStampz = () => {
  const date = new Date()
  const offset = -date.getTimezoneOffset() // En minutos
  const sign = offset >= 0 ? '+' : '-'
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0')

  return `${date.toISOString().replace('Z', '')} ${sign}${hours}:${minutes}`
  }  
  