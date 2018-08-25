const webrtc = {}
webrtc.RTCPeerConnection =  window.RTCPeerConnection || window.mozRTCPeerConnection || 
                            window.webkitRTCPeerConnection || window.msRTCPeerConnection
webrtc.RTCSessionDescription =  window.RTCSessionDescription || window.mozRTCSessionDescription ||
                                window.webkitRTCSessionDescription || window.msRTCSessionDescription
navigator.getUserMedia =    navigator.getUserMedia || navigator.mozGetUserMedia ||
                            navigator.webkitGetUserMedia || navigator.msGetUserMedia

let pc, dc

const ws = new WebSocket('ws://signalingsv.herokuapp.com')
ws.onopen = e => {
    console.log('ws onopen', e)
}
ws.onclose = e => {
    console.log('ws onclose', e)
}
ws.onerror = e => {
    console.error('ws onerror', e)
}
ws.onmessage = e => {
    console.log('ws onmessage', e)

    setAnswer(e.data)
}
const sendSdp = sdp => {
    console.log('sendSdp', sdp)
    ws.send(sdp.sdp)
}

const makeOffer = async () => {
    console.log('makeOffer')
    const config = {'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'},
        {'urls': 'stun:stun1.l.google.com:19302'},
        {'urls': 'stun:stun2.l.google.com:19302'},
        {'urls': 'stun:stun3.l.google.com:19302'}
    ]}
    pc = new webrtc.RTCPeerConnection(config)

    dc = pc.createDataChannel('test')
    dc.onopen = e => {
        console.log('dc onopen', e)
        alert()
    }
    dc.onclose = e => {
        console.log('dc onclose', e)
    }
    dc.onmessage = e => {
        console.log('dc onmessage', e)
    }

    pc.onicecandidate = e => {
        console.log('pc onicecandidate')
        const candidate = e.candidate
        if (!candidate) {
            sendSdp(pc.localDescription)
        }
    }

    const desc = await pc.createOffer()
    await pc.setLocalDescription(desc)
}

const setAnswer = sdp => {
    pc.setRemoteDescription(new webrtc.RTCSessionDescription({
        'type': 'answer',
        'sdp': sdp
    }))
}

makeOffer();