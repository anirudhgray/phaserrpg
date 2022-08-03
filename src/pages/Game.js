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
      <div className='absolute top-0 left-0 right-0 flex flex-row gap-4 justify-content-between'>
        <div class='col-3' id='video-you'></div>
        <div className='col-9 grid' id='video-remotes'></div>
      </div>
      <div id='game'></div>
    </>
  )
}
