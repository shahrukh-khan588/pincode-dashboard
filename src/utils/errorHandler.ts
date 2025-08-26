import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function transformErrorResponse(error: FetchBaseQueryError, fallbackMessage: string) {
  const status = (error as any)?.status
  const data = (error as any)?.data
  const message = (data && (data as any).error) || (data && (data as any).message) || fallbackMessage

  return {
    status,
    message,
    raw: error
  }
}


