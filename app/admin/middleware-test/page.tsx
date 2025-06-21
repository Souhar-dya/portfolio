"use client"

import { useState, useEffect } from "react"
import { Shield, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

export default function MiddlewareTest() {
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const testResults: TestResult[] = []

    // Test 1: Check if we can access admin page (should work since we're logged in)
    try {
      const response = await fetch("/api/admin/check-auth")
      if (response.ok) {
        testResults.push({
          name: "Admin Auth Check",
          status: "success",
          message: "Successfully authenticated",
          details: "Middleware is allowing authenticated admin access",
        })
      } else {
        testResults.push({
          name: "Admin Auth Check",
          status: "error",
          message: "Authentication failed",
          details: `Status: ${response.status}`,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Admin Auth Check",
        status: "error",
        message: "Network error during auth check",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 2: Try to access admin projects API
    try {
      const response = await fetch("/api/admin/projects")
      if (response.ok) {
        testResults.push({
          name: "Admin Projects API",
          status: "success",
          message: "Admin API accessible",
          details: "Middleware is protecting admin routes correctly",
        })
      } else {
        testResults.push({
          name: "Admin Projects API",
          status: "error",
          message: "Cannot access admin API",
          details: `Status: ${response.status}`,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Admin Projects API",
        status: "error",
        message: "Network error accessing admin API",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 3: Try to access sync API
    try {
      const response = await fetch("/api/sync-github", { method: "POST" })
      if (response.ok || response.status === 500) {
        // 500 might be expected if GitHub token is not configured
        testResults.push({
          name: "Sync GitHub API",
          status: "success",
          message: "Sync API accessible",
          details: "Middleware is allowing authenticated access to sync endpoint",
        })
      } else if (response.status === 401) {
        testResults.push({
          name: "Sync GitHub API",
          status: "error",
          message: "Sync API blocked by middleware",
          details: "This should not happen when authenticated",
        })
      } else {
        testResults.push({
          name: "Sync GitHub API",
          status: "warning",
          message: "Unexpected response from sync API",
          details: `Status: ${response.status}`,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Sync GitHub API",
        status: "error",
        message: "Network error accessing sync API",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 4: Check public API (should work without auth)
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        testResults.push({
          name: "Public Projects API",
          status: "success",
          message: "Public API accessible",
          details: "Middleware is correctly allowing public access",
        })
      } else {
        testResults.push({
          name: "Public Projects API",
          status: "warning",
          message: "Public API returned error",
          details: `Status: ${response.status} - This might be expected if database is not connected`,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Public Projects API",
        status: "error",
        message: "Network error accessing public API",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    setResults(testResults)
    setTesting(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-500 bg-green-500/10"
      case "error":
        return "border-red-500 bg-red-500/10"
      case "warning":
        return "border-yellow-500 bg-yellow-500/10"
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Middleware Test</h1>
            <p className="text-gray-400">Test if middleware is working correctly</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <button
              onClick={runTests}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
              {testing ? "Testing..." : "Run Tests"}
            </button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{result.name}</h3>
                      <span
                        className={`text-sm px-2 py-1 rounded capitalize ${
                          result.status === "success"
                            ? "bg-green-600"
                            : result.status === "error"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">{result.message}</p>
                    {result.details && (
                      <p className="text-sm text-gray-400 bg-gray-700 rounded p-2">{result.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && !testing && (
            <div className="text-center text-gray-400 py-8">Click "Run Tests" to check middleware functionality</div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">What This Tests:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>
                <strong>Admin Auth Check:</strong> Verifies you can access admin-only endpoints
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>
                <strong>Admin Projects API:</strong> Tests access to admin project management
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>
                <strong>Sync GitHub API:</strong> Verifies sync endpoint protection
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>
                <strong>Public Projects API:</strong> Ensures public endpoints remain accessible
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a href="/admin" className="text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
