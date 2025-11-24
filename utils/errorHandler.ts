export interface AuthError {
  status?: number
  message: string
  details?: Array<{ message: string }>
}

export const handleAuthError = (error: AuthError) => {
  const errorTypes: Record<number, { type: string; title: string }> = {
    400: { type: 'validation', title: 'Validation Error' },
    401: { type: 'unauthorized', title: 'Authentication Required' },
    403: { type: 'forbidden', title: 'Access Denied' },
    423: { type: 'locked', title: 'Account Locked' },
    429: { type: 'rate_limit', title: 'Too Many Requests' },
    500: { type: 'server', title: 'Server Error' },
  }

  const errorInfo = errorTypes[error.status || 500] || {
    type: 'unknown',
    title: 'Unknown Error',
  }

  return {
    ...errorInfo,
    message: error.message,
    details: error.details || [],
    timestamp: new Date().toISOString(),
  }
}

export const getErrorMessage = (
  error: any,
  language: 'ar' | 'en' = 'en'
): string => {
  const messages = {
    ar: {
      'User already exists': 'المستخدم موجود بالفعل',
      'Invalid credentials': 'بيانات الاعتماد غير صحيحة',
      'Email not verified': 'البريد الإلكتروني غير مُفعّل',
      'Token expired': 'انتهت صلاحية الرمز',
      'User not found': 'المستخدم غير موجود',
      'Network Error': 'خطأ في الشبكة',
      'Server Error': 'خطأ في الخادم',
      'Validation Error': 'خطأ في التحقق من البيانات',
      'Account locked': 'الحساب مقفل',
      'Too many requests': 'طلبات كثيرة جداً',
    },
    en: {
      'User already exists': 'User already exists',
      'Invalid credentials': 'Invalid email or password',
      'Email not verified': 'Please verify your email first',
      'Token expired': 'Verification token has expired',
      'User not found': 'User not found',
      'Network Error': 'Network connection error',
      'Server Error': 'Server error occurred',
      'Validation Error': 'Please check your input',
      'Account locked': 'Account is temporarily locked',
      'Too many requests': 'Too many requests. Please try again later',
    },
  }

  const message = error?.message || 'Unknown error'
  return (
    messages[language][message as keyof (typeof messages)[typeof language]] ||
    message
  )
}
