import { createContext, useContext, useState, useEffect } from "react"
import { transactions as defaultData } from "../data/transactionsData"

const AppContext = createContext()

export function AppProvider({ children }) {

  // Transactions
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("financeiq_transactions")
      return saved ? JSON.parse(saved) : defaultData
    } catch {
      return defaultData
    }
  })

  // Role
  const [role, setRole] = useState(
    localStorage.getItem("financeiq_role") || "viewer"
  )

  //DARK MODE
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("financeiq_dark")

    if (saved !== null) {
      return saved === "true"
    }

    return true 
  })

  // Tabs
  const [tab, setTab] = useState("dashboard")

  // Save transactions
  useEffect(() => {
    localStorage.setItem("financeiq_transactions", JSON.stringify(transactions))
  }, [transactions])

  // Save role
  useEffect(() => {
    localStorage.setItem("financeiq_role", role)
  }, [role])

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem("financeiq_dark", darkMode)
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  // Add transaction
  function addTransaction(tx) {
    const newTx = { ...tx, id: Date.now() }
    setTransactions(prev => [newTx, ...prev])
  }

  // Edit transaction
  function editTransaction(id, updated) {
    setTransactions(prev =>
      prev.map(tx => (tx.id === id ? { ...tx, ...updated } : tx))
    )
  }

  // Delete transaction
  function deleteTransaction(id) {
    if (!window.confirm("Delete this transaction?")) return
    setTransactions(prev => prev.filter(tx => tx.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        role, setRole,
        darkMode, setDarkMode,
        tab, setTab,
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)