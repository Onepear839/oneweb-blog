'use client'  
import React, { useState, useEffect } from 'react'  
const STORAGE_KEY = 'blogPosts'  
export default function BlogManagePage() {  
  const [posts, setPosts] = useState([])  
  const [newPost, setNewPost] = useState({ slug: '', title: '', excerpt: '', content: '' })  
  const [isClient, setIsClient] = useState(false)  
  // 读取本地存储  
  useEffect(() => {  
    // 确保只在客户端运行  
    setIsClient(true)  
      
    if (typeof window === 'undefined') return  
    try {  
      const stored = localStorage.getItem(STORAGE_KEY)  
      if (stored) {  
        setPosts(JSON.parse(stored))  
      }  
    } catch {  
      setPosts([])  
    }  
  }, [])  
  // 保存到本地存储  
  const savePosts = (newPosts) => {  
    setPosts(newPosts)  
    if (typeof window !== 'undefined') {  
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))  
    }  
  }  
  // 新增博客  
  const handleAdd = () => {  
    if (!newPost.slug.trim() || !newPost.title.trim()) {  
      alert('Slug 和标题不能为空')  
      return  
    }  
    if (posts.find(p => p.slug === newPost.slug.trim())) {  
      alert('Slug 已存在，换一个吧')  
      return  
    }  
    const postToAdd = {  
      ...newPost,  
      slug: newPost.slug.trim(),  
      title: newPost.title.trim(),  
      excerpt: newPost.excerpt.trim() || newPost.content.substring(0, 60),  
      content: newPost.content.trim(),  
      updatedAt: new Date().toISOString(),  
    }  
    savePosts([...posts, postToAdd])  
    setNewPost({ slug: '', title: '', excerpt: '', content: '' })  
  }  
  // 删除博客  
  const handleDelete = (slug) => {  
    if (typeof window !== 'undefined' && confirm('确认删除？')) {  
      savePosts(posts.filter(p => p.slug !== slug))  
    }  
  }  
  // 更新时间  
  const handleUpdateTime = (slug) => {  
    const updatedPosts = posts.map(post =>  
      post.slug === slug ? { ...post, updatedAt: new Date().toISOString() } : post  
    )  
    savePosts(updatedPosts)  
  }  
  // 在客户端加载前显示加载状态  
  if (!isClient) {  
    return (  
      <div className="max-w-3xl mx-auto p-6">  
        <h1 className="text-3xl font-bold mb-6">博客管理页</h1>  
        <p>加载中...</p>  
      </div>  
    )  
  }  
  return (  
    <div className="max-w-3xl mx-auto p-6">  
      <h1 className="text-3xl font-bold mb-6">博客管理页</h1>  
      {/* 新增博客表单 */}  
      <div className="mb-8 space-y-4 border p-6 rounded shadow bg-white">  
        <input  
          type="text"  
          placeholder="Slug (英文短路径, 如 hello-world)"  
          className="w-full border rounded px-3 py-2"  
          value={newPost.slug}  
          onChange={e => setNewPost({ ...newPost, slug: e.target.value })}  
        />  
        <input  
          type="text"  
          placeholder="标题"  
          className="w-full border rounded px-3 py-2"  
          value={newPost.title}  
          onChange={e => setNewPost({ ...newPost, title: e.target.value })}  
        />  
        <input  
          type="text"  
          placeholder="摘要 (可选)"  
          className="w-full border rounded px-3 py-2"  
          value={newPost.excerpt}  
          onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })}  
        />  
        <textarea  
          placeholder="正文 Markdown 内容"  
          className="w-full border rounded px-3 py-2 h-32"  
          value={newPost.content}  
          onChange={e => setNewPost({ ...newPost, content: e.target.value })}  
        />  
        <button  
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"  
          onClick={handleAdd}  
        >  
          添加博客  
        </button>  
      </div>  
      {/* 博客列表 */}  
      <ul className="space-y-4">  
        {posts.length === 0 && <p>暂无博客</p>}  
        {posts.map(post => (  
          <li key={post.slug} className="flex justify-between items-center border p-4 rounded shadow bg-white">  
            <div>  
              <p className="font-semibold text-lg">{post.title}</p>  
              <p className="text-gray-600 text-sm truncate max-w-xs">{post.excerpt}</p>  
              <p className="text-gray-400 text-xs mt-1">最后更新时间: {new Date(post.updatedAt).toLocaleString()}</p>  
            </div>  
            <div className="space-x-2">  
              <button  
                onClick={() => handleUpdateTime(post.slug)}  
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"  
              >  
                更新时间  
              </button>  
              <button  
                onClick={() => handleDelete(post.slug)}  
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"  
              >  
                删除  
              </button>  
            </div>  
          </li>  
        ))}  
      </ul>  
    </div>  
  )  
}  
