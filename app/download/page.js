'use client'

import React, { useState, useEffect } from 'react'

export default function DownloadPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [visibleItems, setVisibleItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  // 读取本地存储
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('downloadItems')
      if (saved) {
        setItems(JSON.parse(saved))
      } else {
        setItems([]) // 默认空
      }
    } catch {
      setItems([])
    }
  }, [])

  // 过滤带动画
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    setVisibleItems([])
    filtered.forEach((item, i) => {
      setTimeout(() => {
        setVisibleItems((vis) => [...vis, item.id])
      }, i * 150)
    })
  }, [searchTerm, items])

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      {/* 右上角搜索框 */}
      <div className="absolute top-6 right-6">
        <input
          type="text"
          placeholder="搜索文件..."
          className="border border-gray-300 rounded px-3 py-1 focus:outline-pink-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h1 className="text-3xl font-bold mb-6">下载文件</h1>

      <div className="space-y-6">
        {filtered.length === 0 && (
          <p className="text-gray-500">没有匹配的文件</p>
        )}

        {filtered.map((file) => {
          const isSelected = selectedId === file.id
          return (
            <div
              key={file.id}
              onClick={() => setSelectedId(file.id)}
              className={`flex items-center border rounded p-4 bg-white shadow cursor-pointer transition
                duration-500
                ${
                  visibleItems.includes(file.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }
                ${
                  isSelected
                    ? 'scale-110 border-pink-500 shadow-xl'
                    : 'scale-100 border-gray-300 hover:scale-105 hover:border-pink-400 hover:shadow-md'
                }
              `}
            >
              {/* 预览图片左侧 */}
              <div
                className={`overflow-hidden rounded border transition-all duration-500 ease-in-out
                  ${
                    isSelected
                      ? 'w-40 h-28 border-pink-500 scale-115'
                      : 'w-20 h-16 border-gray-300 hover:w-24 hover:h-20 hover:border-pink-400'
                  }
                `}
              >
                <img
                  src={file.imageUrl}
                  alt={`预览图 - ${file.name}`}
                  className={`w-full h-full object-cover transition-transform duration-300
                    ${isSelected ? 'scale-115' : 'hover:scale-110'}
                  `}
                />
              </div>

              {/* 文件名，文字居中 */}
              <div className="flex-1 relative mx-6">
                <span className="block absolute left-0 right-0 top-1/2 transform -translate-y-1/2 text-center transition-transform duration-300 ease-in-out">
                  {file.name}
                </span>
              </div>

              {/* 右侧按钮组：教程 和 下载 */}
              <div className="flex space-x-4">
                <button
                  className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(file.tutorial, '_blank')
                  }}
                >
                  教程
                </button>

                <a
                  href={file.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  下载
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
