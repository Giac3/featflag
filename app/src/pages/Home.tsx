import { useState } from "react"
import anime from 'animejs/lib/anime.es.js';
import newCode from '../assets/code2.png'
import oldCode from '../assets/code1.png'

const Home = () => {

    const [isActive, setIsActive] = useState(false)
    const [clicked, setClicked] = useState(false)
    
    const handleFlagChange = (state: boolean) => {
        if (state) {
          anime({
            targets: '#new_text',
            opacity: [0,1],
            scale: [0,1],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'normal',
            loop: false
          });
          anime({
            targets: '#old_text',
            opacity: [1,0],
            scale: [1,0],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'normal',
            loop: false
          });
            anime({
                targets: '#disabled_top',
                strokeDashoffset: [document.getElementById("disabled_top")?.style.strokeDashoffset, anime.setDashoffset],
                strokeOpacity: 0,
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function(el, i) { return i * 250 },
                direction: 'alternate',
                loop: false
              });
            anime({
                targets: '#active_below',
                strokeOpacity: 1,
                strokeDashoffset: [clicked ? document.getElementById("active_below")?.style.strokeDashoffset : anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function(el, i) { return i * 250 },
                direction: "alternate",
                loop: false
              });
              setIsActive(state)
        } else {
          anime({
            targets: '#old_text',
            opacity: [0,1],
            scale: [0,1],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'normal',
            loop: false
          });
          anime({
            targets: '#new_text',
            opacity: [1,0],
            scale: [1,0],
            easing: 'easeInOutSine',
            duration: 500,
            direction: 'normal',
            loop: false
          });
            anime({
                targets: '#disabled_top',
                strokeDashoffset: [document.getElementById("disabled_top")?.style.strokeDashoffset, 0],
                strokeOpacity: 1,
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function(el, i) { return i * 250 },
                direction: 'alternate',
                loop: false
              });
            anime({
                targets: '#active_below',
                strokeOpacity: 0,
                strokeDashoffset: [document.getElementById("active_below")?.style.strokeDashoffset, anime.setDashoffset],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function(el, i) { return i * 250 },
                direction: "alternate",
                loop: false,
              });
              setIsActive(state)
        }
        if (!clicked) setClicked(true)
    }

  return (
    <div className='w-full h-screen flex flex-col bg-main p-12'>
      <div className="w-full h-12">
        <h1 id="new_text" className=" font-LuckiestGuy text-6xl absolute opacity-0">Welcome To FeatFlag</h1> 
        <h1 id="old_text" className=" font-LuckiestGuy text-6xl absolute">FeatFlag</h1>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="h-full flex items-center">
            <div className="flex flex-col">
                <div className="flex">
                <div className="ml-[25px] -mb-10">
                <svg width="301" height="301" viewBox="0 0 96 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="active_top" d="M0.499878 71L0.499921 3C0.499922 1.89543 1.39535 1 2.49992 1L95.5 1" stroke="#88FF77"/>
                <path id="disabled_top" d="M0.499878 71L0.499921 3C0.499922 1.89543 1.39535 1 2.49992 1L95.5 1" stroke="#FF7777"/>
                </svg>

                </div>
                <div className="bg-black h-full rounded-md overflow-hidden shadow-2xl -ml-1">
                    <img src={newCode}/>
                </div>
                </div>
            <div className="bg-[#D9D9D9] w-14 h-14 rounded-full shadow-inner flex items-center justify-center z-10">
                {
                    isActive && <button onClick={() => {handleFlagChange(false)}} className="bg-[#88FF77] h-9 w-9 rounded-full shadow-md absolute"></button>
                }
                {
                    !isActive && <button onClick={() => {handleFlagChange(true)}} className="bg-[#FF7777] h-9 w-9 rounded-full shadow-md absolute"></button>
                }
            </div>
            <div className="flex">
            <div className="ml-[25px] -mt-10">
            <svg width="301" height="301" viewBox="0 0 96 71" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            <path id="disabled_below" d="M1 0L1.00004 68C1.00004 69.1046 1.89547 70 3.00004 70L96.0001 70" stroke="#88FF77"/>
            <path id="active_below" d="M1 0L1.00004 68C1.00004 69.1046 1.89547 70 3.00004 70L96.0001 70" strokeOpacity={0} stroke="#FF7777"/>
            </svg>
            </div>
            <div className="bg-black h-full rounded-md overflow-hidden self-end shadow-2xl">
                    <img src={oldCode}/>
                </div>
            </div>
            </div>
            
        </div>
        <div className="absolute flex flex-col items-center justify-center gap-2">
          <h1 className="text-2xl font-LuckiestGuy">Manage your feature flags with ease</h1> 
        <a href="/signup" className="bg-white p-2 rounded-md flex items-center shadow-md">Join Now</a>
        </div>
      </div>
    </div>
  )
}

export default Home
