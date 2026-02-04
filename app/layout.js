import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: '我的个人博客',
  description: '用Next.js打造的个人博客网站',
}

export default function RootLayout({ children }) {
  return (

    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        {/* <Footer /> 如果需要页脚，可以放这里 */}
      </body>
    </html>
  )
}