import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export type ItemProgress = {
  id: string; score: number; completed: boolean; notes: string; updated_at: string
}

type Track = 'python' | 'claude' | 'english' | 'fastapi' | 'realworld' | 'book-management'

function storageKey(track: Track) {
  return track === 'python' ? 'py25_progress' : 'claude_progress'
}

function localGet(track: Track): Record<string, ItemProgress> {
  try { return JSON.parse(localStorage.getItem(storageKey(track)) || '{}') } catch { return {} }
}

function localSet(track: Track, data: Record<string, ItemProgress>) {
  localStorage.setItem(storageKey(track), JSON.stringify(data))
}

export function useProgress(userId?: string, track: Track = 'python') {
  const [progress, setProgress] = useState<Record<string, ItemProgress>>(() => localGet(track))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setProgress(localGet(track))
  }, [track])

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    supabase.from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('track', track)
      .then(({ data }) => {
        if (data) {
          const map = Object.fromEntries(data.map(r => [r.item_id, r]))
          setProgress(map)
          localSet(track, map)
        }
        setLoading(false)
      })
  }, [userId, track])

  const saveProgress = async (itemId: string, update: Partial<ItemProgress>) => {
    const current = progress[itemId] || { id: itemId, score: 0, completed: false, notes: '', updated_at: '' }
    const next = { ...current, ...update, id: itemId, updated_at: new Date().toISOString() }
    const newProgress = { ...progress, [itemId]: next }
    setProgress(newProgress)
    localSet(track, newProgress)

    if (userId) {
      await supabase.from('progress').upsert({
        user_id: userId,
        item_id: itemId,
        track,
        score: next.score,
        completed: next.completed,
        notes: next.notes,
        updated_at: next.updated_at,
      })
    }
  }

  const totalScore = Object.values(progress).reduce((s, p) => s + (p.score || 0), 0)
  const completedDays = Object.values(progress).filter(p => p.completed).length

  return { progress, saveProgress, loading, totalScore, completedDays }
}
