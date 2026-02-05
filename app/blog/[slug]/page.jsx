'use client'  
import React, { useEffect, useState } from 'react'  
import { useParams } from 'next/navigation'  
import { marked } from 'marked'  
const STORAGE_KEY = 'blogPosts'  
export default function BlogDetailPage() {  
  const { slug } = useParams()  
  const [post, setPost] = useState(null)  
  const [isClient, setIsClient] = useState(false)  
  useEffect(() => {  
    // 确保只在客户端运行  
    setIsClient(true)  
      
    if (typeof window !== 'undefined') {  
      const stored = localStorage.getItem(STORAGE_KEY)  
      if (stored) {  
        const posts = JSON.parse(stored)  
        const found = posts.find(p => p.slug === slug)  
        setPost(found || null)  
      }  
    }  
  }, [slug])  
  // 在客户端加载前显示加载状态  
  if (!isClient) {  
    return (  
      <div className="max-w-3xl mx-auto p-6">  
        <p>加载中...</p>  
      </div>  
    )  
  }  
  if (!post) {  
    return (  
      <div className="max-w-3xl mx-auto p-6">  
        <p>未找到该博客</p>  
      </div>  
    )  
  }  
  return (  
    <div className="max-w-3xl mx-auto p-6">  
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>  
      <div  
        className="prose max-w-full mb-6"  
        dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }}  
      />  
      <p className="text-gray-400 text-sm">  
        最后更新时间: {new Date(post.updatedAt).toLocaleString()}  
      </p>  
    </div>  
  )  
}  
