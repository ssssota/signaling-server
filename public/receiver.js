const webrtc = {}
webrtc.RTCPeerConnection =  window.RTCPeerConnection || window.mozRTCPeerConnection || 
                            window.webkitRTCPeerConnection || window.msRTCPeerConnection
webrtc.RTCSessionDescription =  window.RTCSessionDescription || window.mozRTCSessionDescription ||
                                window.webkitRTCSessionDescription || window.msRTCSessionDescription
navigator.getUserMedia =    navigator.getUserMedia || navigator.mozGetUserMedia ||
                            navigator.webkitGetUserMedia || navigator.msGetUserMedia

let pc, dc

const ws = new WebSocket('wss://signalingsv.herokuapp.com')
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

    setOffer(e.data);
}
const sendSdp = sdp => {
    console.log('sendSdp', sdp)
    ws.send(sdp.sdp)
}

const setOffer = async sdp => {
    console.log('setOffer')
    const config = {'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'},
        {'urls': 'stun:stun1.l.google.com:19302'},
        {'urls': 'stun:stun2.l.google.com:19302'},
        {'urls': 'stun:stun3.l.google.com:19302'}
    ]}
    pc = new webrtc.RTCPeerConnection(config)

    pc.ondatachannel = e => {
        console.log('pc ondatachannel')
        dc = e.channel

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
    }

    pc.onicecandidate = e => {
        console.log('pc onicecandidate')
        const candidate = e.candidate
        if (!candidate) {
            sendSdp(pc.localDescription)
        }
    }

    await pc.setRemoteDescription(new webrtc.RTCSessionDescription({
        'type': 'offer',
        'sdp': sdp
    }))
    const desc = await pc.createAnswer()
    await pc.setLocalDescription(desc);
}