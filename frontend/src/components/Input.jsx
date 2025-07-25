import React from 'react'

const Input = ({icon:Icon,...props}) => {
  return (
    <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 flex items-center
         pl-3 pointer-events-none'>
            <Icon className='size-5 text-green-500' />
        </div>
        <input {...props}
        className='w-full pl-10 pr-7 py-2 
           border-0 border-b border-b-zinc-400  outline-none
          text-white placeholder-gray-400 transition duration-200'
        />
    </div>
  )
}

export default Input