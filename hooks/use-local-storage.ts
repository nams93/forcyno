"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // État pour stocker notre valeur
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialiser l'état avec la valeur du localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      console.error(error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Fonction pour mettre à jour la valeur dans le localStorage
  const setValue = (value: T) => {
    try {
      // Permettre à la valeur d'être une fonction
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))

      // Sauvegarder dans l'état
      setStoredValue(valueToStore)
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

