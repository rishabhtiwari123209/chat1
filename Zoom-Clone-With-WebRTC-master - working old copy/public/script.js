const socket = io('/')//connect to our root path 
const videoGrid = document.getElementById('video-grid')

const p = document.getElementById('p')//rishabh1 add line
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true//i don`t want to listen my voice
const peers = {}


// const rishuPara= document.createElement('p')//rishhu2
// rishuPara.innerText = "This is a paragraph";//rishu3
// document.body.appendChild(rishuPara);




// 1
navigator.mediaDevices.getUserMedia({//if user give permission to domain then promise occur it send them stream
  video: true,
  audio: true
}).then(stream => {   //stream is a combination of video and audio
  addVideoStream(myVideo, stream);//it call 5 number function

  myPeer.on('call', call => {
    call.answer(stream)    //it will get to me all stream of other user vedio
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {   //it will send my stream to other user
      addVideoStream(video, userVideoStream)   //by addvideo stream function
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)// it  pass stream= room id and user id(unique bcoz of peer.js) (bcoz a lot of user over there)
   console.log("user"+userId+"room"+ROOM_ID+"<br>");


   const rishuPara= document.createElement('p')//rishhu2
rishuPara.innerText ="user=> "+userId+"    room=> "+ROOM_ID;//rishu3
document.body.appendChild(rishuPara);
  })
})


// 2
socket.on('user-disconnected', userId => {
  console.log(userId);

  const rishuPara= document.createElement('p')//rishhu2
  rishuPara.innerText ="user=> "+userId+" is disconnnected from room";//rishu3
  document.body.appendChild(rishuPara);


  
  if (peers[userId]) peers[userId].close()//jo peer ne userid createkia hai use close kar do
})


// 3
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})


// 4
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)   //it mypeer.call is call a user para userid created by peer
  const video = document.createElement('video')//and stream=send our stream to another
  call.on('stream', userVideoStream => {//this line stream means other user send stream to me
    addVideoStream(video, userVideoStream)//other user can visible himself on screen by addvideostream
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}


// 5 add video stream only
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}