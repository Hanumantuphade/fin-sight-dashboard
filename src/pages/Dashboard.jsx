import { useMemo } from "react"
import { useApp } from "../context/AppContext"
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts"
import { motion } from "framer-motion"
import { ArrowRight, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { COLORS } from "../data/transactionsData"


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function formatINR(n) {
  return "₹" + n.toLocaleString("en-IN")
}


function Card({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">{title}</p>
        <Icon size={18} color={color} />
      </div>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {value}
      </h2>
    </motion.div>
  )
}

export default function Dashboard() {
  const { transactions, setTab } = useApp()

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0)

  const balance = income - expenses

  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleString("default", { month: "short" })
      if (!map[month]) map[month] = { month, balance: 0 }

      if (t.type === "income") map[month].balance += t.amount
      else map[month].balance -= t.amount
    })
    return Object.values(map)
  }, [transactions])

  const categoryData = useMemo(() => {
    const map = {}
    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount
      })

    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const recentTxns = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="p-4 md:p-8">

      {/* HEADER */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Your financial overview
      </p>

      {/* CARDS */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <Card icon={Wallet} title="Balance" value={formatINR(balance)} color="#6366f1" />
        <Card icon={TrendingUp} title="Income" value={formatINR(income)} color="#22c55e" />
        <Card icon={TrendingDown} title="Expenses" value={formatINR(expenses)} color="#ef4444" />
      </motion.div>

      {/* CHART + PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* AREA CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Balance Trend
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" stroke="#888" />
              <YAxis />

              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                fill="url(#g)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            By Category
          </p>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || "#8884d8"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* RECENT */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm"
        >
          <div className="flex justify-between mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recent Transactions
            </p>

            <button
              onClick={() => setTab("transactions")}
              className="text-sm text-indigo-500 flex items-center gap-1"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          {recentTxns.map((t) => (
            <div key={t.id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-white/10">
              <span className="text-gray-700 dark:text-white">{t.description}</span>
              <span className={t.type === "income" ? "text-green-500" : "text-red-500"}>
                {formatINR(t.amount)}
              </span>
            </div>
          ))}
        </motion.div>

        {/* INSIGHTS */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="rounded-2xl p-5 border bg-white border-stone-200 dark:bg-[#111827] dark:border-white/10"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Insights
            </p>

            <button
              onClick={() => setTab("insights")}
              className="text-sm flex items-center gap-1 text-indigo-500 hover:underline"
            >
              Explore <ArrowRight size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Savings</span>
              <span className="text-green-500 font-medium">{formatINR(balance)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Spending</span>
              <span className="text-red-500 font-medium">{formatINR(expenses)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Trend</span>
              <span className="text-indigo-500 font-medium">Stable 📊</span>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  )
}