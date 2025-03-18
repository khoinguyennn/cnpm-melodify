"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const DataTable = ({ columns, data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const currentData = sortedData.slice(startIndex, endIndex)

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => handleSort(column.key)} style={{ cursor: "pointer" }}>
                {column.label}
                {sortColumn === column.key && <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable

