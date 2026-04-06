import { AppProvider, useApp } from "./context/AppContext"
import Sidebar from "./components/Sidebar"
import MobileNav from "./components/MobileNav"
import Dashboard from "./pages/Dashboard"
import Transactions from "./pages/Transactions"
import Insights from "./pages/Insights"

function PageContent() {
  const { tab } = useApp()
  return (
    <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-white dark:bg-[#0B0F19] text-black dark:text-white">
      {tab === "dashboard" && <Dashboard />}
      {tab === "transactions" && <Transactions />}
      {tab === "insights" && <Insights />}
    </main>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-white dark:bg-[#0B0F19]">
        <Sidebar />
        <MobileNav />
        <PageContent />
      </div>
    </AppProvider>
  )
}