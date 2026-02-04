'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'blogPosts'

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="border rounded p-4 shadow animate-pulse bg-gray-200"
          style={{ height: '80px' }}
        />
      ))}
    </div>
  )
}

const listItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function BlogPage() {
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPosts(JSON.parse(stored))
      } else {
        setPosts([])
      }
    }, 1000)
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">博客列表</h1>

      {posts === null && <LoadingSkeleton />}

      {posts !== null && (
        <>
          {posts.length === 0 && <p>暂无博客</p>}
          <ul className="space-y-6">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.li
                  key={post.slug}
                  className="list-none"
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="
                      block border rounded p-4 shadow-sm 
                      transition-transform duration-500 ease-out
                      hover:shadow-lg hover:scale-105
                      relative cursor-pointer no-underline
                    "
                  >
                    <h2 className="text-xl font-semibold text-pink-600 mb-1">{post.title}</h2>
                    <p className="text-gray-600">{post.excerpt}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      最后更新时间: {new Date(post.updatedAt).toLocaleString()}
                    </p>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </div>
  )
}
