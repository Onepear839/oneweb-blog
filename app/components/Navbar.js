'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const links = [
    { href: '/blog', label: '博客' },
    { href: '/about', label: '关于我' },
    { href: '/download', label: '下载' },
  ]

  const [highlightedLink, setHighlightedLink] = useState(null)

  const clearHighlight = () => setHighlightedLink(null)

  return (
    <nav
      aria-label="主导航"
      className="bg-pink-100 py-4 shadow-md relative"
    >
      <div className="container mx-auto flex items-center space-x-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`
            relative font-bold text-xl text-pink-600
            cursor-pointer
            transition-colors duration-300 ease-in-out
            hover:text-pink-700
            focus:outline-none
          `}
          tabIndex={0}
          onFocus={() => setHighlightedLink('home')}
          onBlur={clearHighlight}
          onMouseEnter={() => setHighlightedLink('home')}
          onMouseLeave={clearHighlight}
          onClick={clearHighlight}
        >
          个人博客
          {highlightedLink === 'home' && (
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -inset-2
                rounded
                bg-gray-300
                transition-opacity duration-300 ease-in-out
                opacity-100
                z-[-1]
              "
            />
          )}
        </Link>

        {links.map(({ href, label }) => {
          const isActive = pathname === href
          const isHighlighted = highlightedLink === href

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative
                text-pink-500
                cursor-pointer
                transition-colors duration-300 ease-in-out
                hover:text-pink-700
                focus:outline-none
                ${isActive ? 'text-pink-700 font-semibold' : ''}
              `}
              tabIndex={0}
              onFocus={() => setHighlightedLink(href)}
              onBlur={clearHighlight}
              onMouseEnter={() => setHighlightedLink(href)}
              onMouseLeave={clearHighlight}
              onClick={clearHighlight}
            >
              {label}
              {isHighlighted && (
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute -inset-2
                    rounded
                    bg-gray-300
                    transition-opacity duration-300 ease-in-out
                    opacity-100
                    z-[-1]
                  "
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
