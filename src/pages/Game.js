import React, { useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { setRoom } from '../app/slices/initialSlice'
import { useDispatch } from 'react-redux'
import Phaser from 'phaser'
import gameConfig from '../game/gameConfig'

export default function Game() {
  const {roomId} = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setRoom({roomName: roomId}))
    const game = new Phaser.Game(gameConfig)

    window.addEventListener('resize', () => {
      game.scale.resize(window.innerWidth, window.innerHeight)
    })
  }, [roomId, dispatch])

  return (
    <>
      <div className="absolute overflow-hidden top-0 left-0 h-screen w-screen">
        <div className="absolute top-0 left-0 h-screen flex flex-column justify-content-between">
          <div className='m-3 w-screen overflow-auto'>
          <div className='flex gap-3' id='video-remotes'></div>
          </div>
          <div>
            <div style={{wordBreak: 'break-word'}} className='m-3 w-min' id='video-you'></div>
            <div className='p-3 flex gap-2 flex-row'>
              <p>{roomId}</p>
              <button id='mute'>Mic On</button>
              <button id='camera'>Camera On</button>
            </div>
          </div>
        </div>
      </div>
      <div id='game'></div>
    </>
  )
}
