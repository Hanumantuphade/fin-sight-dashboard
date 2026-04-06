import { useState, useMemo } from "react"
import { useApp } from "../context/AppContext"
import { Plus, Search } from "lucide-react"
import { CATEGORIES } from "../data/transactionsData"
import TransactionForm from "../components/TransactionForm"
import TransactionTable from "../components/TransactionTable"

const PER_PAGE = 12
const EMPTY_FORM = {
  date: "",
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
}

// clean modern input style
const inputCls =
  "border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs " +
  "bg-white dark:bg-[#121826] text-gray-700 dark:text-gray-300 " +
  "focus:outline-none focus:ring-1 focus:ring-purple-500"

export default function Transactions() {
  const { transactions, role, addTransaction, editTransaction } = useApp()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [catFilter, setCatFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [page, setPage] = useState(1)

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  //  filtering + sorting
  const filtered = useMemo(() => {
    let list = [...transactions]

    if (search) {
      list = list.filter((t) =>
        t.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (typeFilter !== "all") {
      list = list.filter((t) => t.type === typeFilter)
    }

    if (catFilter !== "all") {
      list = list.filter((t) => t.category === catFilter)
    }

    const [field, dir] = sortBy.split("-")

    list.sort((a, b) => {
      const av = field === "amount" ? a.amount : new Date(a.date)
      const bv = field === "amount" ? b.amount : new Date(b.date)
      return dir === "desc" ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1)
    })

    return list
  }, [transactions, search, typeFilter, catFilter, sortBy])

  // reset page on filter change
  useMemo(() => setPage(1), [search, typeFilter, catFilter, sortBy])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function openEdit(tx) {
    setForm({
      date: tx.date,
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      type: tx.type,
    })
    setEditId(tx.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function closeForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  function handleSubmit() {
    if (!form.date || !form.description || !form.amount) return

    const tx = {
      ...form,
      amount: Number(form.amount),
    }

    editId ? editTransaction(editId, tx) : addTransaction(tx)
    closeForm()
  }

  //  export CSV
  function exportCSV() {
    const rows = [
      "Date,Description,Category,Type,Amount",
      ...filtered.map(
        (t) =>
          `${t.date},${t.description},${t.category},${t.type},${t.amount}`
      ),
    ]

    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "transactions.csv"
    a.click()
  }

  return (
    <div className="p-3 md:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Transactions
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {filtered.length} records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="hidden sm:block text-xs px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition"
          >
            Export CSV
          </button>

          {role === "admin" && (
            <button
              onClick={showForm && !editId ? closeForm : openAdd}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>
      </div>

      {/* 🔍 FILTERS */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className={inputCls + " pl-6 w-36"}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={inputCls}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className={inputCls}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={inputCls}
        >
          <option value="date-desc">Latest</option>
          <option value="date-asc">Oldest</option>
          <option value="amount-desc">Highest</option>
          <option value="amount-asc">Lowest</option>
        </select>
      </div>

      {/*  FORM */}
      {showForm && role === "admin" && (
        <div className="mb-4 bg-white dark:bg-[#121826] border border-gray-200 dark:border-white/10 rounded-xl p-4">
          <TransactionForm
            form={form}
            setForm={setForm}
            editId={editId}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-[#121826] border border-gray-200 dark:border-white/10 rounded-xl">
        <TransactionTable
          rows={paginated}
          page={page}
          setPage={setPage}
          total={filtered.length}
          onEdit={openEdit}
        />
      </div>

    </div>
  )
}