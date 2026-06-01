import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export type DayProgress = {
  day: number; score: number; completed: boolean; notes: string; updated_at: string
}

const STORAGE_KEY = 'py25_progress'

function localGet(): Record<number, DayProgress> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function localSet(data: Record<number, DayProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useProgress(userId?: string) {
  const [progress, setProgress] = useState<Record<number, DayProgress>>(localGet)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase.from('progress').select('*').eq('user_id', userId)
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map(r => [r.day, r]))
          setProgress(map)
          localSet(map)
        }
        setLoading(false)
      })
  }, [userId])

  const saveProgress = async (day: number, update: Partial<DayProgress>) => {
    const current = progress[day] || { day, score: 0, completed: false, notes: '', updated_at: '' }
    const next = { ...current, ...update, day, updated_at: new Date().toISOString() }
    const newProgress = { ...progress, [day]: next }
    setProgress(newProgress)
    localSet(newProgress)

    if (userId) {
      await supabase.from('progress').upsert({ ...next, user_id: userId })
    }
  }

  const totalScore = Object.values(progress).reduce((s, p) => s + (p.score || 0), 0)
  const completedDays = Object.values(progress).filter(p => p.completed).length

  return { progress, saveProgress, loading, totalScore, completedDays }
}
