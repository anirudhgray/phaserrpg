import React, {useState} from 'react'
import { setName, setRoom } from '../app/slices/initialSlice'
import { useDispatch } from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Landing() {
  const [charName, setCharName] = useState('')
  const [roomName, setRoomName] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleClick = (e) => {
    e.preventDefault()
    if (charName && roomName) {
      dispatch(setName({charName}))
      dispatch(setRoom({roomName}))
      navigate(`/game/${roomName}`)
    }
  }

  return (
    <div className='flex' style={{'background':'grey'}}>
      <div className='m-auto p-3' style={{'background':'white'}}>
        <input value={charName} onChange={e => setCharName(e.target.value)} placeholder='Character Name'></input>
        <input value={roomName} onChange={e => setRoomName(e.target.value)} placeholder='Room'></input>
        <button type='submit' onClick={handleClick}>Enter</button>
      </div>
    </div>
  )
}
