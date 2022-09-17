import AgoraRTC from "agora-rtc-sdk-ng";

// import { store } from '../../app/store'
import axios from 'axios'

let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
};

let options = {
    // Pass your App ID here.
    appId: process.env.REACT_APP_APP_ID,
    // Set the channel name.
    channel: null,
    // Pass your temp token here.
    token: process.env.REACT_APP_TOKEN,
    // Set the user ID.
    uid: null,
};

export async function startBasicCall(uid, channel) {

    options.uid = uid;
    options.channel = channel;

    await axios.get(`https://metaverse-backend.herokuapp.com/token?channelName=${options.channel}`, {
        headers: {
            channel: options.channel
        }
    })
    .then(res => {
        options.token = res.data.token
    })

    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.

    rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes a video track.
        if (mediaType === "video") {
            // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
            const remoteVideoTrack = user.videoTrack;
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            const remotePlayerContainer = document.createElement("div");
            // Specify the ID of the DIV container. You can use the uid of the remote user.
            remotePlayerContainer.id = 'video'+ user.uid.toString();
            remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
            remotePlayerContainer.style.width = "160px";
            remotePlayerContainer.style.height = "120px";
            remotePlayerContainer.style.display = 'none'
            document.getElementById('video-remotes').appendChild(remotePlayerContainer);

            // Play the remote video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
            remoteVideoTrack.play(remotePlayerContainer);
        }

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track. No need to pass any DOM element.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-left", user => {
            // Get the dynamically created DIV container.
            const remotePlayerContainer = document.getElementById('video'+user.uid);
            // Destroy the container.
            remotePlayerContainer.remove();
        });
    });

            // Join an RTC channel.
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);

            // Create a local audio track from the audio sampled by a microphone.
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Create a local video track from the video captured by a camera.
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

            document.getElementById('mute').addEventListener('click',function (e) {
                if (e.currentTarget.textContent === 'Mute') {
                    e.currentTarget.textContent = 'Unmute'
                    console.log("ok")
                    rtc.localAudioTrack.setEnabled(false)
                } else {
                    e.currentTarget.textContent = 'Mute'
                    console.log("ok")
                    rtc.localAudioTrack.setEnabled(true)
                }
            })
            // Publish the local audio and video tracks to the RTC channel.
            await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
            // Dynamically create a container in the form of a DIV element for playing the local video track.
            const localPlayerContainer = document.createElement("div");
            // Specify the ID of the DIV container. You can use the uid of the local user.
            localPlayerContainer.id = options.uid;
            localPlayerContainer.textContent = "Local user " + options.uid;
            localPlayerContainer.style.width = "160px";
            localPlayerContainer.style.height = "120px";
            localPlayerContainer.style.position = 'absolute';
            localPlayerContainer.style.top = 0;
            localPlayerContainer.style.left = 0;
            document.getElementById('video-you').appendChild(localPlayerContainer);

            // Play the local video track.
            // Pass the DIV container and the SDK dynamically creates a player in the container for playing the local video track.
            rtc.localVideoTrack.play(localPlayerContainer);
            console.log("publish success!");

        // document.getElementById("leave").onclick = async function () {
        //     // Destroy the local audio and video tracks.
        //     rtc.localAudioTrack.close();
        //     rtc.localVideoTrack.close();

        //     // Traverse all remote users.
        //     rtc.client.remoteUsers.forEach(user => {
        //         // Destroy the dynamically created DIV containers.
        //         const playerContainer = document.getElementById(user.uid);
        //         playerContainer && playerContainer.remove();
        //     });

        //     // Leave the channel.
        //     await rtc.client.leave();
        // };
}
