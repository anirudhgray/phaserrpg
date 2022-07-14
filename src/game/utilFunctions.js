export function update(scene) {
  const cursors = scene.input.keyboard.createCursorKeys()
  if (cursors.left.isDown && cursors.up.isDown) {
    scene.gridEngine.move(scene.socket._id, 'up-left')
    scene.socket.emit('playerMove', {direction:'up-left', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: -1, y:-1}})
  } else if (cursors.left.isDown && cursors.down.isDown) {
    scene.gridEngine.move(scene.socket._id, 'down-left')
    scene.socket.emit('playerMove', {direction:'down-left', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: -1, y:1}})
  } else if (cursors.right.isDown && cursors.up.isDown) {
    scene.gridEngine.move(scene.socket._id, 'up-right')
    scene.socket.emit('playerMove', {direction:'up-right', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: 1, y:-1}})
  } else if (cursors.right.isDown && cursors.down.isDown) {
    scene.gridEngine.move(scene.socket._id, 'down-right')
    scene.socket.emit('playerMove', {direction:'down-right', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: 1, y:1}})
  } else if (cursors.left.isDown) {
    scene.gridEngine.move(scene.socket._id, 'left')
    scene.socket.emit('playerMove', {direction:'left', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: -1, y:0}})
  } else if (cursors.right.isDown) {
    scene.gridEngine.move(scene.socket._id, 'right')
    scene.socket.emit('playerMove', {direction:'right', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: 1, y:0}})
  } else if (cursors.up.isDown) {
    scene.gridEngine.move(scene.socket._id, 'up')
    scene.socket.emit('playerMove', {direction:'up', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: 0, y:-1}})
  } else if (cursors.down.isDown) {
    scene.gridEngine.move(scene.socket._id, 'down')
    scene.socket.emit('playerMove', {direction:'down', position: scene.gridEngine.getPosition(scene.socket._id), offset: {x: 0, y:1}})
  }
}
