const webrtc = {}
webrtc.RTCPeerConnection =  window.RTCPeerConnection || window.mozRTCPeerConnection || 
                            window.webkitRTCPeerConnection || window.msRTCPeerConnection
webrtc.RTCSessionDescription =  window.RTCSessionDescription || window.mozRTCSessionDescription ||
                                window.webkitRTCSessionDescription || window.msRTCSessionDescription
navigator.getUserMedia =    navigator.getUserMedia || navigator.mozGetUserMedia ||
                            navigator.webkitGetUserMedia || navigator.msGetUserMedia

let pc, dc

const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host)
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
const sendSdp = async sdp => {
    console.log('sendSdp', sdp)
    await waitWebSocketReady()
    ws.send(sdp.sdp)
}
const waitWebSocketReady = () => {
    console.log('waitWebSocket')
    return new Promise(resolve => {
        setTimeout(() => {
            resolve((ws.readyState == 1)? ws.readyState: waitWebSocketReady())
        }, 1000)
    })
}

const setOffer = async sdp => {
    console.log('setOffer')
    const config = {'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'},
        {'urls': 'stun:stun1.l.google.com:19302'}
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