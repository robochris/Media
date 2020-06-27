import React, {Component} from 'react';
import SingleFriend from './SingleFriend'
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import './App.css';
import io from "socket.io-client";
const { RTCPeerConnection, RTCSessionDescription } = window;
navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
const peerConnCfg = {'iceServers': [
     {"urls": "stun:stun2.1.google.com:19302"}
]}

let peerConnection
let localStream = null
let isAlreadyCalling = false
let socket;
const mapStateToProps = (state) => ({
  user: state.session.user
})


const prepareCall = (socketId, mySocket) =>  {
  return new Promise((resolve, reject) => {
    peerConnection = new RTCPeerConnection(peerConnCfg)
    peerConnection.onicecandidate = event => {
      if (!event || !event.candidate) {return}
      mySocket.emit("ICE", {to: socketId, candidate: event.candidate});
    }
    peerConnection.ontrack = function({streams: [stream]}) {
      const remoteVideo = document.getElementById("remoteVideo")
      if(remoteVideo.srcObject !== stream) {
        remoteVideo.srcObject = stream;
      }
    }
    resolve("PREPARE DONE")
  })
}

const onIceCandidate = async (event) => {
  console.log("ICE")
  try {
    await (peerConnection.addIceCandidate(new RTCIceCandidate(event.candidate)));
  } catch (e) {
    console.log(e)
  }
}

const createAndSendOffer = async (socketId, mySocket) => {
  await peerConnection.createOffer(function(offer) {
      var off = new RTCSessionDescription(offer)
      peerConnection.setLocalDescription(new RTCSessionDescription(off), function() {
        mySocket.emit("callUser", {offer,to: socketId});
      }, error=> console.log("ITS ERROR 1", error))
  }, error=>console.log("ITS ERROR 2", error));
}

const createAndSendAnswer = async (data, mySocket, inCall) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))
  await peerConnection.createAnswer(answer => {
    var ans = new RTCSessionDescription(answer)
    peerConnection.setLocalDescription(new RTCSessionDescription(ans),
    () => {
        mySocket.emit("makeAnswer", {answer, to: data.socket});
    }, error => console.log("ANSWER ERROR 1: ", error))
  }, error => console.log("ANSWER ERROR 2: ", error))
}

const answerCall = async (data, mySocket, inCall) => {
  await prepareCall(data.socket, mySocket).then(()=>{
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream)=>{
    const localVideo = document.getElementById("local-video");
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    createAndSendAnswer(data, mySocket, inCall);
  })
}).catch(error=>console.log("FUCKING ERROR"))
}

const callUser = async (socketId, mySocket) => {
  await prepareCall(socketId, mySocket).then(()=>{
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream)=> {
    const localVideo = document.getElementById("local-video");
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    createAndSendOffer(socketId, mySocket);
  }).catch((error)=>console.log("CALL USER ERROR: ",error))
}).catch(error=>console.log("PREPARE WENT ROUGE: ", error))
}


const startSockets = (socket, inCall) => {
  socket = socket
  console.log("WE SHIT: ", socket)
  socket.on("gettingCalled", data => {
    answerCall(data, socket, inCall);
  })

  socket.on("ICERecieve", async data => {
    try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (e) {
    console.log(e)
  }
  })

  socket.on("answerMade", async data => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
  })
}

const friendsGet = async (userId) => {
  return await axios.post('http://localhost:6969/friends/', {userId}).then(function(res){
     return res.data
   }).catch(function(err){
       console.log(err)
     });
}

class Video extends Component {
  constructor(props){
  super(props);
  this.state={
    friends: [],
    mySocket: [],
    inCall: false
  }
 }
 componentDidMount() {
   if(this.props.user) {
   friendsGet(this.props.user._id)
   .then(friends => {
     this.setState({friends, mySocket: this.props.user.socket})
   })
   startSockets(this.props.user.socket, this.inCallChange)}
 }

 inCallChange = boolean => this.setState({inCall: boolean})
 callUser = socketId => callUser(socketId, this.state.mySocket, this.state.inCall)

 render() {
  if(!this.props.user) {
    return (<div>No User</div>)
  } else {
    return (
      <div>
        {(this.state.friends || []).map(friend => (
          <SingleFriend friend={friend} callUser={this.callUser}/>
        ))}
        <div className="video-chat-container">
              <div className="video-container">
                <video
                  autoPlay
                  className="remote-video"
                  id="remoteVideo"
                ></video>
                <video
                  autoPlay
                  muted
                  className="local-video"
                  id="local-video"
                ></video>
              </div>
            </div>
      </div>
    );
  }
 }
}
export default withRouter(connect(mapStateToProps)(Video))
