import React from 'react'

export default function Footer() {
  return (
    <div className="bg-[--color-background] py-4">
      <div className="container mx-auto text-center">
        <p className="text-[--color-foreground] text-sm">
          &copy; {new Date().getFullYear()} Wall-Damage-Analysis-and-Cost-Estimation.com. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          <a href="/privacy" className="hover:underline">Privacy Policy</a> | <a href="/terms" className="hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  )
}
