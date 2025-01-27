import React from 'react'



const CarCard = ({ make = "Maruti Suzuki", model = "Desire", price = "Rs. 4.20 Lakh", image }) => {



  return (
    <div className=' '>
      <div className='  border-black w-[380px] h[100px] ' >
        
        <div className='h-[25%] border-2 border-black flex justify-between'>
          <div className='flex flex-col items-start justify-center pl-1'>
            <p className='text-gray-100'> {make}</p>
            <h1 className='text-2xl'>{model}</h1>
          </div>

          <div className='flex flex-col items-end justify-center pr-1'>
            <h1 className='text-xl'>{price}</h1>
            <p className='text-white text-sm'>onwards</p>
          </div>
        </div>
      </div>
      
    </div>
    
  )
}

export default CarCard