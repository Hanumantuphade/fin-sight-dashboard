import { useApp } from "../context/AppContext"
import { Sun, Moon, ShieldCheck, Eye } from "lucide-react"
import { NAV_TABS } from "../constants"

export default function Sidebar() {
  const { tab, setTab, darkMode, setDarkMode, role, setRole } = useApp()

  return (
    <aside
      className="
        hidden md:flex flex-col w-60 shrink-0 min-h-screen p-5 border-r
        
        /*  LIGHT MODE */
        bg-white border-stone-200
        
        /*  DARK MODE */
        dark:bg-gradient-to-b dark:from-[#020617] dark:to-[#0a1022] 
        dark:border-white/10
      "
    >
      
      {/* Logo */}
      <div className="mb-8 px-1">
        <p className="text-lg font-semibold tracking-tight text-stone-800 dark:text-white">
          Zorvyn
        </p>
        <p className="mt-0.5 text-xs text-stone-400 dark:text-gray-400">
          Fintech
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={
              "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 " +
              
             (tab === id
  ? `
    /* ACTIVE - TEXT GRADIENT ONLY */
    bg-transparent
    
    bg-gradient-to-r 
    from-amber-500 to-orange-500 
    bg-clip-text text-transparent

    dark:from-amber-300 dark:to-orange-400
    font-semibold
  `
  : `
    /* INACTIVE */
    text-stone-500 hover:bg-stone-100 hover:text-stone-900
    dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white
  `)
            }
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-6 flex flex-col gap-4">

        {/* Role */}
        <div>
          <p className="mb-2 px-1 text-xs text-stone-400 dark:text-gray-400">
            Role
          </p>

          <div
            className="
              flex overflow-hidden rounded-xl border
                
              /* LIGHT */
              border-stone-200 bg-stone-100
              
              /* DARK */
              dark:border-white/10 dark:bg-[#0B0F20]
            "
          >
            {["viewer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={
                  "flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium transition-all " +
                  (role === r
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "text-stone-500 hover:bg-white dark:text-gray-400 dark:hover:bg-white/5")
                }
              >
                {r === "admin" ? <ShieldCheck size={12} /> : <Eye size={12} />}
                {r === "admin" ? "Admin" : "Viewer"}
              </button>
            ))}
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="
            flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all
            
            /* LIGHT */
            text-stone-500 hover:bg-stone-100 hover:text-stone-900
            
            /* DARK */
            dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white
          "
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

      </div>
    </aside>
  )
}