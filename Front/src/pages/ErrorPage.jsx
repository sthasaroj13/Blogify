import React from 'react'
import { Link } from 'react-router-dom'

function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-4">Page not found</h2>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link to='/'>Go back Home</Link>
        </button>
      </section>
    </div>
  )
}

export default ErrorPage
