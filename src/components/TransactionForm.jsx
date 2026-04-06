import { useApp } from "../context/AppContext"
import { CATEGORIES } from "../data/transactionsData"
import { motion } from "framer-motion"

const inputCls =
  "border rounded-lg px-3 py-2 text-sm transition-all duration-200 " +

  /* LIGHT */
  "border-stone-200 bg-white text-stone-700 placeholder:text-stone-400 " +

  /* DARK (SOFT DARK - NOT BLACK) */
  "dark:border-white/10 dark:bg-[#111827] dark:text-stone-300 dark:placeholder:text-gray-500 " +

  /* FOCUS */
  "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"


/* Animation Variants */
const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
}

export default function TransactionForm({ form, setForm, editId, onSubmit, onCancel }) {
  const { role } = useApp()

  if (role !== "admin") return null

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="
        rounded-xl p-5 mb-4 border
        
        /* LIGHT */
        bg-white border-stone-200 shadow-sm
        
        /* DARK (FIXED) */
        dark:bg-[#111827] dark:border-white/10 dark:shadow-lg
      "
    >
      
      {/* Title */}
      <motion.p
        variants={item}
        className="text-sm font-semibold mb-4 text-stone-800 dark:text-white"
      >
        {editId ? "Edit Transaction" : "New Transaction"}
      </motion.p>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        
        <motion.input
          variants={item}
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className={inputCls}
        />

        <motion.input
          variants={item}
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className={inputCls}
        />

        <motion.input
          variants={item}
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          className={inputCls}
        />

        <motion.select
          variants={item}
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={inputCls}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </motion.select>

        <motion.select
          variants={item}
          value={form.type}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          className={inputCls}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </motion.select>
      </div>

      {/* Buttons */}
      <motion.div variants={item} className="flex gap-2">
        
        {/* Primary */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          className="
            text-sm px-4 py-2 rounded-lg text-white transition-all duration-200
            
            bg-gradient-to-r from-amber-500 to-orange-500
            hover:from-amber-600 hover:to-orange-600
            
            shadow-sm hover:shadow-md
          "
        >
          {editId ? "Update" : "Save"}
        </motion.button>

        {/* Secondary */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="
            text-sm px-4 py-2 rounded-lg border transition-all duration-200
            
            /* LIGHT */
            border-stone-200 text-stone-600 hover:bg-stone-100
            
            /* DARK */
            dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/5
          "
        >
          Cancel
        </motion.button>

      </motion.div>
    </motion.div>
  )
}