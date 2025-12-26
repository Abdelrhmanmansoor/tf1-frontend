'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (_open: boolean) => void
  children: React.ReactNode
}

interface AlertDialogContentProps {
  children: React.ReactNode
}

interface AlertDialogHeaderProps {
  children: React.ReactNode
}

interface AlertDialogFooterProps {
  children: React.ReactNode
}

interface AlertDialogTitleProps {
  children: React.ReactNode
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
}

interface AlertDialogActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface AlertDialogCancelProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const AlertDialogContext = React.createContext<{
  open: boolean
  onOpenChange: (_open: boolean) => void
} | null>(null)

export function AlertDialog({
  open = false,
  onOpenChange,
  children,
}: AlertDialogProps) {
  return (
    <AlertDialogContext.Provider
      value={{ open, onOpenChange: onOpenChange || (() => {}) }}
    >
      {children}
    </AlertDialogContext.Provider>
  )
}

export function AlertDialogTrigger({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(AlertDialogContext)

  return (
    <button {...props} onClick={() => context?.onOpenChange(true)}>
      {children}
    </button>
  )
}

export function AlertDialogContent({ children }: AlertDialogContentProps) {
  const context = React.useContext(AlertDialogContext)

  if (!context) return null

  return (
    <AnimatePresence>
      {context.open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => context.onOpenChange(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
  return <div className="mb-4">{children}</div>
}

export function AlertDialogFooter({ children }: AlertDialogFooterProps) {
  return <div className="flex gap-2 justify-end mt-6">{children}</div>
}

export function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
}

export function AlertDialogDescription({
  children,
}: AlertDialogDescriptionProps) {
  return <p className="text-sm text-gray-600 mt-2">{children}</p>
}

export function AlertDialogAction({
  children,
  className = '',
  ...props
}: AlertDialogActionProps) {
  const context = React.useContext(AlertDialogContext)

  return (
    <button
      {...props}
      onClick={(e) => {
        props.onClick?.(e)
        context?.onOpenChange(false)
      }}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function AlertDialogCancel({
  children,
  className = '',
  ...props
}: AlertDialogCancelProps) {
  const context = React.useContext(AlertDialogContext)

  return (
    <button
      {...props}
      onClick={(e) => {
        props.onClick?.(e)
        context?.onOpenChange(false)
      }}
      className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}
