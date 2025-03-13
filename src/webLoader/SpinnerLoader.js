import React from 'react'

export default function SpinnerLoader({ color }) {
  return (
    <div className='loaderlayer'>
      <div className='web-loader'
        style={{ backgroundColor: color ? color : 'rgb(0 0 0 / 85%)', borderRadius: color &&'15px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )
}
