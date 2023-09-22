import anime from 'animejs';
import { useEffect } from 'react'

const Loader = () => {

  useEffect(() => {
    anime({
      targets: '#left_loader',
      scale: [0.5, 1],
      easing: 'easeInOutSine',
      duration: 1000,
      delay: 0,
      direction: "alternate",
      loop: true,
    });
    anime({
      targets: '#middle_loader',
      scale: [0.5, 1],
      easing: 'easeInOutSine',
      duration: 1000,
      delay: 0,
      direction: "alternate",
      loop: true,
    });
    anime({
      targets: '#right_loader',
      scale: [0.5, 1],
      easing: 'easeInOutSine',
      duration: 1000,
      delay: 0,
      direction: "alternate",
      loop: true,
    });
  }, [])

  return (
    <div className='flex p-2 gap-2'>
      <div id='left_loader' className='bg-white h-4 w-4 rounded-full shadow-md'></div>
      <div id='middle_loader' className='bg-white h-4 w-4 rounded-full shadow-md'></div>
      <div id='right_loader' className='bg-white h-4 w-4 rounded-full shadow-md'></div>
    </div>
  )
}

export default Loader
