'use client'  
import React, { useState, useEffect } from 'react'  
import { useRouter } from 'next/navigation'  
const PASSWORD_STORAGE_KEY = 'managePagePassword'  
const LOGIN_STATE_KEY = 'managePageLoggedIn'  
export default function ManagePage() {  
  const router = useRouter()  
  const [storedPassword, setStoredPassword] = useState('admin123')  
  const [authenticated, setAuthenticated] = useState(false)  
  const [passwordInput, setPasswordInput] = useState('')  
  const [error, setError] = useState('')  
  const [showChangePwd, setShowChangePwd] = useState(false)  
  const [oldPasswordInput, setOldPasswordInput] = useState('')  
  const [newPasswordInput, setNewPasswordInput] = useState('')  
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('')  
  const [changePwdMsg, setChangePwdMsg] = useState('')  
  const [items, setItems] = useState([])  
  const [isClient, setIsClient] = useState(false)  
  const [newItem, setNewItem] = useState({  
    name: '',  
    tutorial: '',  
    download: '',  
    imageFile: null,  
    imageUrl: '',  
  })  
  useEffect(() => {  
    // 确保只在客户端运行  
    setIsClient(true)  
      
    if (typeof window === 'undefined') return  
    try {  
      const saved = localStorage.getItem('downloadItems')  
      setItems(saved ? JSON.parse(saved) : [])  
    } catch {  
      setItems([])  
    }  
    const pwd = localStorage.getItem(PASSWORD_STORAGE_KEY)  
    if (pwd) setStoredPassword(pwd)  
    const loggedIn = localStorage.getItem(LOGIN_STATE_KEY)  
    if (loggedIn === 'true') setAuthenticated(true)  
  }, [])  
  const saveItems = (newItems) => {  
    setItems(newItems)  
    try {  
      if (typeof window !== 'undefined') {  
        localStorage.setItem('downloadItems', JSON.stringify(newItems))  
      }  
    } catch {}  
  }  
  const checkPassword = () => {  
    if (passwordInput === storedPassword) {  
      setAuthenticated(true)  
      setError('')  
      if (typeof window !== 'undefined') {  
        localStorage.setItem(LOGIN_STATE_KEY, 'true')  
      }  
      setPasswordInput('')  
    } else {  
      setError('密码错误，请重试')  
    }  
  }  
  const handleLogout = () => {  
    setAuthenticated(false)  
    if (typeof window !== 'undefined') {  
      localStorage.setItem(LOGIN_STATE_KEY, 'false')  
    }  
  }  
  const handleImageChange = (e) => {  
    const file = e.target.files?.[0]  
    if (file) {  
      setNewItem((prev) => ({  
        ...prev,  
        imageFile: file,  
        imageUrl: URL.createObjectURL(file),  
      }))  
    }  
  }  
  const handleAdd = () => {  
    if (!newItem.name.trim()) return alert('请输入文件名称')  
    if (!newItem.tutorial.trim()) return alert('请输入教程链接')  
    if (!newItem.download.trim()) return alert('请输入下载链接')  
    if (!newItem.imageUrl) return alert('请上传图片')  
    const id = Date.now()  
    const newEntry = {  
      id,  
      name: newItem.name.trim(),  
      tutorial: newItem.tutorial.trim(),  
      download: newItem.download.trim(),  
      imageUrl: newItem.imageUrl,  
    }  
    const updated = [...items, newEntry]  
    saveItems(updated)  
    setNewItem({ name: '', tutorial: '', download: '', imageFile: null, imageUrl: '' })  
  }  
  const handleDelete = (id) => {  
    if (typeof window !== 'undefined' && window.confirm('确认删除该项目吗？')) {  
      const filtered = items.filter((item) => item.id !== id)  
      saveItems(filtered)  
    }  
  }  
  const handleChangePassword = () => {  
    setChangePwdMsg('')  
    if (oldPasswordInput !== storedPassword) {  
      setChangePwdMsg('旧密码错误')  
      return  
    }  
    if (newPasswordInput.length < 6) {  
      setChangePwdMsg('新密码至少6位')  
      return  
    }  
    if (newPasswordInput !== confirmPasswordInput) {  
      setChangePwdMsg('新密码和确认密码不一致')  
      return  
    }  
    setStoredPassword(newPasswordInput)  
    if (typeof window !== 'undefined') {  
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPasswordInput)  
    }  
    setChangePwdMsg('密码修改成功')  
    setOldPasswordInput('')  
    setNewPasswordInput('')  
    setConfirmPasswordInput('')  
  }  
  // 在客户端加载前显示加载状态  
  if (!isClient) {  
    return (  
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">  
        <div className="bg-white p-8 rounded shadow max-w-sm w-full">  
          <p>加载中...</p>  
        </div>  
      </div>  
    )  
  }  
  if (!authenticated) {  
    return (  
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">  
        <div className="bg-white p-8 rounded shadow max-w-sm w-full">  
          <h2 className="text-2xl mb-4 font-bold">请输入管理密码</h2>  
          <input  
            type="password"  
            className="w-full border px-3 py-2 rounded mb-4"  
            placeholder="密码"  
            value={passwordInput}  
            onChange={(e) => setPasswordInput(e.target.value)}  
            onKeyDown={(e) => {  
              if (e.key === 'Enter') checkPassword()  
            }}  
            autoFocus  
          />  
          {error && <p className="text-red-500 mb-4">{error}</p>}  
          <button  
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"  
            onClick={checkPassword}  
          >  
            确认  
          </button>  
        </div>  
      </div>  
    )  
  }  
  return (  
    <div className="p-6 max-w-3xl mx-auto">  
      <div className="flex justify-between items-center mb-6">  
        <h1 className="text-3xl font-bold">下载管理页面</h1>  
        <button  
          onClick={handleLogout}  
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"  
        >  
          登出  
        </button>  
      </div>  
      {/* 添加新项目 */}  
      <div className="mb-8 space-y-4 border p-6 rounded shadow bg-white">  
        <div>  
          <label className="block mb-1 font-semibold">文件名称</label>  
          <input  
            type="text"  
            className="w-full border rounded px-3 py-2"  
            value={newItem.name}  
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}  
          />  
        </div>  
        <div>  
          <label className="block mb-1 font-semibold">教程链接</label>  
          <input  
            type="text"  
            className="w-full border rounded px-3 py-2"  
            placeholder="如：https://example.com/tutorial"  
            value={newItem.tutorial}  
            onChange={(e) => setNewItem({ ...newItem, tutorial: e.target.value })}  
          />  
        </div>  
        <div>  
          <label className="block mb-1 font-semibold">下载链接</label>  
          <input  
            type="text"  
            className="w-full border rounded px-3 py-2"  
            placeholder="如：https://example.com/download"  
            value={newItem.download}  
            onChange={(e) => setNewItem({ ...newItem, download: e.target.value })}  
          />  
        </div>  
        <div>  
          <label className="block mb-1 font-semibold">上传预览图片</label>  
          <input type="file" accept="image/*" onChange={handleImageChange} />  
          {newItem.imageUrl && (  
            <img  
              src={newItem.imageUrl}  
              alt="预览图"  
              className="mt-2 w-40 h-28 object-cover rounded border"  
            />  
          )}  
        </div>  
        <button  
          onClick={handleAdd}  
          className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"  
        >  
          添加项目  
        </button>  
      </div>  
      {/* 展示项目列表 */}  
      <ul className="space-y-6">  
        {items.length === 0 && <p className="text-gray-500">暂无项目</p>}  
        {items.map(({ id, name, tutorial, download, imageUrl }) => (  
          <li key={id} className="flex items-center justify-between bg-white p-4 rounded shadow">  
            <div className="flex items-center space-x-4">  
              <img  
                src={imageUrl}  
                alt={name}  
                className="w-24 h-16 object-cover rounded border"  
              />  
              <div>  
                <p className="font-semibold text-lg">{name}</p>  
                <p className="text-sm text-gray-600 truncate max-w-xs">{tutorial}</p>  
                <p className="text-sm text-gray-600 truncate max-w-xs">{download}</p>  
              </div>  
            </div>  
            <div className="flex space-x-4">  
              <a  
                href={tutorial}  
                target="_blank"  
                rel="noopener noreferrer"  
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"  
              >  
                教程  
              </a>  
              <a  
                href={download}  
                target="_blank"  
                rel="noopener noreferrer"  
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"  
              >  
                下载  
              </a>  
              <button  
                onClick={() => handleDelete(id)}  
                className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"  
              >  
                删除  
              </button>  
            </div>  
          </li>  
        ))}  
      </ul>  
      {/* 修改密码功能 */}  
      <div  
        className="mt-12 cursor-pointer text-pink-600 font-semibold select-none"  
        onClick={() => setShowChangePwd((v) => !v)}  
      >  
        修改密码 {showChangePwd ? '▲' : '▼'}  
      </div>  
      {showChangePwd && (  
        <div className="mt-4 p-4 border rounded shadow bg-white max-w-md">  
          <input  
            type="password"  
            placeholder="旧密码"  
            className="w-full border rounded px-3 py-2 mb-3"  
            value={oldPasswordInput}  
            onChange={(e) => setOldPasswordInput(e.target.value)}  
          />  
          <input  
            type="password"  
            placeholder="新密码（至少6位）"  
            className="w-full border rounded px-3 py-2 mb-3"  
            value={newPasswordInput}  
            onChange={(e) => setNewPasswordInput(e.target.value)}  
          />  
          <input  
            type="password"  
            placeholder="确认新密码"  
            className="w-full border rounded px-3 py-2 mb-3"  
            value={confirmPasswordInput}  
            onChange={(e) => setConfirmPasswordInput(e.target.value)}  
          />  
          {changePwdMsg && (  
            <p className={`mb-3 ${changePwdMsg.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>  
              {changePwdMsg}  
            </p>  
          )}  
          <button  
            className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"  
            onClick={handleChangePassword}  
          >  
            修改密码  
          </button>  
        </div>  
      )}  
      {/* 博客管理入口 */}  
      <div className="mt-12">  
        <button  
          onClick={() => router.push('/manage/blogs')}  
          className="text-pink-600 underline hover:text-pink-800"  
        >  
          进入博客管理页面 →  
        </button>  
      </div>  
    </div>  
  )  
}  
