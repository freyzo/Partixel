'use client'

import { useEffect } from 'react'

export function RemoveNextBadge() {
  useEffect(() => {
    // Remove Next.js DevTools badge
    const removeBadge = () => {
      const selectors = [
        '[data-nextjs-dev-tools-button]',
        '[data-nextjs-dev-tools]',
        '#next-logo',
        '.nextjs-dev-tools',
        '.nextjs-badge',
        '[class*="nextjs"]',
      ]
      
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(el => {
          el.remove()
        })
      })
      
      // Also try to find by looking for fixed position elements with z-index
      const allElements = document.querySelectorAll('*')
      allElements.forEach(el => {
        const style = window.getComputedStyle(el)
        const rect = el.getBoundingClientRect()
        
        // Look for small fixed elements in bottom-left corner
        if (
          style.position === 'fixed' &&
          rect.left < 50 &&
          rect.bottom > window.innerHeight - 50 &&
          rect.width < 50 &&
          rect.height < 50
        ) {
          el.remove()
        }
      })
    }
    
    // Run immediately and after a delay
    removeBadge()
    const timeout = setTimeout(removeBadge, 1000)
    const interval = setInterval(removeBadge, 2000)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])
  
  return null
}
