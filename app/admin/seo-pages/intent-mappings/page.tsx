'use client'

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Pencil, Trash2, X, Check, Link2 } from "lucide-react"
import Link from "next/link"
import { fetchAllIntentMappings, saveIntentMapping, removeIntentMapping } from "./actions"

interface IntentMapping {
  id: string
  sourceType: string
  sourceValue: string
  urlSegment: string
  displayName: string
  category: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const EMPTY_FORM = {
  sourceType: 'body_style',
  sourceValue: '',
  urlSegment: '',
  displayName: '',
  category: 'car',
  isActive: true,
}

export default function IntentMappingsPage() {
  const [mappings, setMappings] = useState<IntentMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  async function loadMappings() {
    const data = await fetchAllIntentMappings()
    setMappings(JSON.parse(JSON.stringify(data)))
    setLoading(false)
  }

  useEffect(() => {
    loadMappings()
  }, [])

  function openAddForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(mapping: IntentMapping) {
    setForm({
      sourceType: mapping.sourceType,
      sourceValue: mapping.sourceValue,
      urlSegment: mapping.urlSegment,
      displayName: mapping.displayName,
      category: mapping.category || 'all',
      isActive: mapping.isActive,
    })
    setEditingId(mapping.id)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveIntentMapping({
        id: editingId || undefined,
        sourceType: form.sourceType,
        sourceValue: form.sourceValue,
        urlSegment: form.urlSegment,
        displayName: form.displayName,
        category: form.category === 'all' ? null : form.category,
        isActive: form.isActive,
      })
      await loadMappings()
      cancelForm()
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await removeIntentMapping(id)
      await loadMappings()
      setConfirmDeleteId(null)
    } catch (err) {
      console.error('Failed to delete:', err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/seo-pages">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to SEO Pages
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Intent Mappings</h1>
              <p className="text-gray-400">Map body styles and tags to SEO URL segments</p>
            </div>
          </div>
          <Button
            onClick={openAddForm}
            className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Mapping
          </Button>
        </div>

        {showForm && (
          <Card className="bg-[#111111] border-[#ECAC36]">
            <CardHeader>
              <CardTitle className="text-white">
                {editingId ? 'Edit Mapping' : 'Add New Mapping'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Source Type</Label>
                  <select
                    value={form.sourceType}
                    onChange={(e) => setForm(f => ({ ...f, sourceType: e.target.value }))}
                    className="w-full mt-1 bg-[#0A0A0A] border border-[#333333] text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="body_style">Body Style</option>
                    <option value="tag">Tag</option>
                  </select>
                </div>

                <div>
                  <Label className="text-gray-300">Source Value</Label>
                  <Input
                    value={form.sourceValue}
                    onChange={(e) => setForm(f => ({ ...f, sourceValue: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                    placeholder="e.g. convertible, wedding"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">URL Segment</Label>
                  <Input
                    value={form.urlSegment}
                    onChange={(e) => setForm(f => ({ ...f, urlSegment: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                    placeholder="e.g. convertible-rental"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Display Name</Label>
                  <Input
                    value={form.displayName}
                    onChange={(e) => setForm(f => ({ ...f, displayName: e.target.value }))}
                    className="bg-[#0A0A0A] border-[#333333] text-white mt-1"
                    placeholder="e.g. Convertible Rental"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full mt-1 bg-[#0A0A0A] border border-[#333333] text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="car">Car</option>
                    <option value="yacht">Yacht</option>
                    <option value="villa">Villa</option>
                    <option value="all">All</option>
                  </select>
                </div>

                <div className="flex items-end pb-1">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={(checked) => setForm(f => ({ ...f, isActive: checked }))}
                    />
                    <Label className="text-gray-300">Active</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || !form.sourceValue || !form.urlSegment || !form.displayName}
                  className="bg-[#ECAC36] hover:bg-[#B8860B] text-black font-bold"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button
                  onClick={cancelForm}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Intent Mappings ({mappings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading...</div>
            ) : mappings.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No intent mappings yet. Click &quot;Add Mapping&quot; to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#333333] text-gray-400">
                      <th className="text-left py-3 px-2">Source Type</th>
                      <th className="text-left py-3 px-2">Source Value</th>
                      <th className="text-left py-3 px-2">URL Segment</th>
                      <th className="text-left py-3 px-2">Display Name</th>
                      <th className="text-left py-3 px-2">Category</th>
                      <th className="text-center py-3 px-2">Active</th>
                      <th className="text-right py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mappings.map((mapping) => (
                      <tr
                        key={mapping.id}
                        className="border-b border-[#222222] hover:bg-[#1a1a1a] transition-colors"
                      >
                        <td className="py-3 px-2">
                          <Badge className={`text-white text-xs ${mapping.sourceType === 'body_style' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                            {mapping.sourceType}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-white font-mono text-xs">
                          {mapping.sourceValue}
                        </td>
                        <td className="py-3 px-2 text-[#ECAC36] font-mono text-xs">
                          {mapping.urlSegment}
                        </td>
                        <td className="py-3 px-2 text-white">
                          {mapping.displayName}
                        </td>
                        <td className="py-3 px-2 text-gray-300 capitalize">
                          {mapping.category || 'all'}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={mapping.isActive ? 'text-green-400' : 'text-red-400'}>
                            {mapping.isActive ? '✓' : '✗'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditForm(mapping)}
                              className="text-gray-400 hover:text-white h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {confirmDeleteId === mapping.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(mapping.id)}
                                  disabled={deletingId === mapping.id}
                                  className="text-red-400 hover:text-red-300 h-8 px-2 text-xs"
                                >
                                  {deletingId === mapping.id ? '...' : 'Confirm'}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmDeleteId(mapping.id)}
                                className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
