import React, { useState } from 'react'
import { X, Edit2, Save, Trash2, Plus } from 'lucide-react'

interface TableColumn {
  key: string
  label: string
  type?: 'text' | 'email' | 'select'
  options?: string[]
}

interface TableRow {
  id: string
  [key: string]: any
}

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  columns: TableColumn[]
  data: TableRow[]
  onSave: (row: TableRow) => void
  onDelete: (id: string) => void
  onAdd: (row: Omit<TableRow, 'id'>) => void
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  title,
  columns,
  data,
  onSave,
  onDelete,
  onAdd
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<TableRow | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newRowData, setNewRowData] = useState<Partial<TableRow>>({})

  const handleEdit = (row: TableRow) => {
    setEditingId(row.id)
    setEditData({ ...row })
  }

  const handleSave = () => {
    if (editData) {
      onSave(editData)
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleAddNew = () => {
    setIsAdding(true)
    setNewRowData({})
  }

  const handleSaveNew = () => {
    if (Object.keys(newRowData).length > 0) {
      onAdd(newRowData as Omit<TableRow, 'id'>)
      setIsAdding(false)
      setNewRowData({})
    }
  }

  const handleCancelNew = () => {
    setIsAdding(false)
    setNewRowData({})
  }

  const renderCell = (column: TableColumn, value: any, isEditing: boolean, onChange?: (value: any) => void) => {
    if (!isEditing) {
      return <span className="text-gray-300">{value || '-'}</span>
    }

    switch (column.type) {
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full"
          >
            <option value="">Select...</option>
            {column.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'email':
        return (
          <input
            type="email"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full"
          />
        )
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm w-full"
          />
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-800 border-l border-gray-700 shadow-xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add New Button */}
        <div className="mb-4">
          <button
            onClick={handleAddNew}
            disabled={isAdding}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Add New Row Form */}
        {isAdding && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
            <h3 className="text-sm font-medium text-white mb-3">Add New {title.slice(0, -1)}</h3>
            <div className="space-y-2">
              {columns.map(column => (
                <div key={column.key}>
                  <label className="block text-xs text-gray-400 mb-1">{column.label}</label>
                  {renderCell(
                    column,
                    newRowData[column.key],
                    true,
                    (value) => setNewRowData(prev => ({ ...prev, [column.key]: value }))
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveNew}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelNew}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="space-y-2">
          {data.map(row => (
            <div key={row.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
              <div className="space-y-2">
                {columns.map(column => (
                  <div key={column.key} className="flex justify-between items-center">
                    <label className="text-xs text-gray-400 w-20 flex-shrink-0">{column.label}:</label>
                    <div className="flex-1 ml-2">
                      {renderCell(
                        column,
                        editingId === row.id ? editData?.[column.key] : row[column.key],
                        editingId === row.id,
                        (value) => setEditData(prev => prev ? { ...prev, [column.key]: value } : null)
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 pt-2 border-t border-gray-600">
                {editingId === row.id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(row)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(row.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No data available</p>
            <p className="text-sm mt-1">Click "Add New" to create your first entry</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SidePanel