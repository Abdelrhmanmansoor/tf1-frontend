export default function DeliverySuspended() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            تم تعليق تسليم الموقع
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 text-center mb-8">
            تم تعليق هذا الموقع مؤقتاً في انتظار قبول العميل للتسليم
          </p>

          {/* Warning Box */}
          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-6 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  التسليم في انتظار القبول
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    تم الانتهاء من الموقع وتسليمه. جميع الوظائف معلقة حتى يقوم
                    العميل بقبول التسليم رسمياً.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">ماذا يعني هذا:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 ml-2">•</span>
                <span>جميع الصفحات والميزات غير متاحة حالياً</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 ml-2">•</span>
                <span>سيتم استعادة الوصول عند قبول التسليم</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 ml-2">•</span>
                <span>هذا تعليق مؤقت وفقاً لشروط العقد</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>للاستفسارات أو لقبول التسليم، يرجى التواصل مع فريق التطوير.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
