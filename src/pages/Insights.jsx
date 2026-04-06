import { useMemo } from "react"
import { useApp } from "../context/AppContext"
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend
} from "recharts"
import {
  ShoppingBag, PiggyBank, TrendingUp, Target, BarChart3, Wallet
} from "lucide-react"
import { COLORS } from "../data/transactionsData"
import { motion } from "framer-motion"

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN")
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

/* ✅ CARD (FIXED DARK BG) */
function Card({ icon: Icon, title, value, subtitle, color }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.04 }}
      className="
        rounded-2xl p-5 border transition
        
        /* LIGHT */
        bg-white border-stone-200 shadow-sm
        
        /* DARK (FIXED - NOT PURE BLACK) */
        dark:bg-[#111827] dark:border-stone-700
      "
    >
      <div className="flex items-start gap-4">
        
        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: color + "20",
            color: color,
          }}
        >
          <Icon size={20} />
        </div>

        <div>
          <p className="text-xs text-stone-400 mb-1 uppercase tracking-wide">
            {title}
          </p>

          <p className="text-xl font-semibold text-stone-800 dark:text-white">
            {value}
          </p>

          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Insights() {
  const { transactions } = useApp()

  const expensesByCategory = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount
      })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [transactions])

  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" })
      if (!map[month]) map[month] = { month, income: 0, expenses: 0 }
      if (t.type === "income") map[month].income += t.amount
      else map[month].expenses += t.amount
    })
    return Object.values(map)
  }, [transactions])

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const totalSpend = expensesByCategory.reduce((s, [, v]) => s + v, 0)

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0

  const topCategory = expensesByCategory[0]

  return (
    <div className="p-4 md:p-8">
      
      {/* Header */}
      <h1 className="text-xl font-semibold text-stone-800 dark:text-white mb-1">
        Insights
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-6">
        Key observations from your financial data
      </p>

      {/* CARDS */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <Card icon={ShoppingBag} title="Top Spending"
          value={topCategory ? topCategory[0] : "—"}
          subtitle={topCategory ? `${formatINR(topCategory[1])}` : "No data"}
          color="#f43f5e"
        />

        <Card icon={PiggyBank} title="Savings Rate"
          value={`${savingsRate}%`}
          subtitle={savingsRate >= 20 ? "Healthy" : "Improve"}
          color="#10b981"
        />

        <Card icon={TrendingUp} title="Total Expenses"
          value={formatINR(totalExpenses)}
          subtitle="Overall spending"
          color="#ef4444"
        />

        <Card icon={Target} title="Net Savings"
          value={formatINR(totalIncome - totalExpenses)}
          subtitle="After expenses"
          color="#8b5cf6"
        />

        <Card icon={BarChart3} title="Total Income"
          value={formatINR(totalIncome)}
          subtitle="All earnings"
          color="#22c55e"
        />

        <Card icon={Wallet} title="Balance"
          value={formatINR(totalIncome - totalExpenses)}
          subtitle="Available now"
          color="#f59e0b"
        />
      </motion.div>

      {/* CHART */}
      <div className="
        rounded-xl p-4 mb-6 border
        bg-white border-stone-200
        dark:bg-[#111827] dark:border-stone-700
      ">
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
          Monthly Comparison
        </p>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BREAKDOWN */}
      <div className="
        rounded-xl p-4 border
        bg-white border-stone-200
        dark:bg-[#111827] dark:border-stone-700
      ">
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
          Expense Breakdown
        </p>

        <div className="flex flex-col gap-3">
          {expensesByCategory.map(([cat, val]) => (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-stone-500 dark:text-stone-400">{cat}</span>
                <span className="text-stone-700 dark:text-white font-medium">
                  {formatINR(val)}
                </span>
              </div>

              <div className="h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(val / totalSpend) * 100}%`,
                    backgroundColor: COLORS[cat],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}