'use client'

import { useEffect, useState } from 'react'

export default function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
      const timeString = now.toLocaleTimeString('en-GB', options)
      setTime(`Zurich ${timeString}`)
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return <div className="clock">{time}</div>
}
