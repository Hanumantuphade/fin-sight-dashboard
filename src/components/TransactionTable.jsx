import { useApp } from "../context/AppContext"
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { COLORS } from "../data/transactionsData"

const PER_PAGE = 12

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
  }
}

function CategoryBadge({ category }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[10px] font-medium"
      style={{ backgroundColor: COLORS[category] + "20", color: COLORS[category] }}
    >
      {category}
    </span>
  )
}

export default function TransactionTable({ rows, page, setPage, total, onEdit }) {
  const { role, deleteTransaction } = useApp()
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className="bg-white dark:bg-[#121826] rounded-xl overflow-hidden">

      {rows.length === 0 ? (
        <p className="text-center py-12 text-sm text-gray-400">
          No transactions found
        </p>
      ) : (
        <>
         
          <div className="md:hidden divide-y divide-gray-200 dark:divide-white/10">
            {rows.map((tx) => {
              const date = formatDate(tx.date)

              return (
                <div key={tx.id} className="px-3 py-3 flex items-center justify-between">

                  {/* LEFT */}
                  <div>
                    <p className="text-sm text-gray-800 dark:text-white">
                      {tx.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span>{date.day} {date.month}</span>
                      <CategoryBadge category={tx.category} />
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-3">

                    {/* amount */}
                    <p
                      className={
                        "text-sm font-medium " +
                        (tx.type === "income"
                          ? "text-emerald-500"
                          : "text-white")
                      }
                    >
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </p>

                    {/* actions */}
                    {role === "admin" && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <button onClick={() => onEdit(tx)}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteTransaction(tx.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ✅ DESKTOP TABLE (unchanged) */}
          <table className="w-full text-sm hidden md:table">
            <thead className="border-b border-gray-200 dark:border-white/10">
              <tr>
                {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? [""] : [])].map((h, i) => (
                  <th key={i} className="text-left text-gray-500 font-medium px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 dark:border-white/10">
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(tx.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-4 py-3">{tx.description}</td>

                  <td className="px-4 py-3">
                    <CategoryBadge category={tx.category} />
                  </td>

                  <td className="px-4 py-3 capitalize">{tx.type}</td>

                  <td className="px-4 py-3">
                    {tx.type === "income" ? "+" : "-"}₹{tx.amount}
                  </td>

                  {role === "admin" && (
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => onEdit(tx)}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteTransaction(tx.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between px-4 py-3 text-xs text-gray-400">
            <span>
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
            </span>

            <div className="flex gap-2 items-center">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft size={16} />
              </button>

              <span>{page}/{totalPages}</span>

              <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}