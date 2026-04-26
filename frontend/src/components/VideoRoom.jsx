import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function VideoRoom({ roomId, userId, userName, onLeave }) {
    const videoContainerRef = useRef(null);

    useEffect(() => {
        if (!videoContainerRef.current) return;

        const myMeeting = async (element) => {
            // 1. Enter your ZEGOCLOUD credentials here
            const appID = Number(import.meta.env.VITE_ZEGO_APP_ID); // Note: ZEGOCLOUD needs AppID as a Number, so we wrap it in Number()
            const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET; // Passed as String

            // 2. Generate a secure token tied to this specific consultation ID
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                userId,
                userName
            );

            // 3. Initialize the ZEGOCLOUD instance
            const zc = ZegoUIKitPrebuilt.create(kitToken);

            // 4. Join the room and mount the UI into our div
            zc.joinRoom({
                container: element,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // Optimized for 1-on-1 telehealth
                },
                showPreJoinView: false, // Skips the camera preview screen
                showScreenSharingButton: false,
                turnOnMicrophoneWhenJoining: true,
                turnOnCameraWhenJoining: true,
                onLeaveRoom: () => {
                    console.log("User left the call");
                    if (onLeave) onLeave();
                }
            });
        };

        myMeeting(videoContainerRef.current);

        // Cleanup when the component unmounts
        return () => {
            if (videoContainerRef.current) {
                videoContainerRef.current.innerHTML = "";
            }
        };
    }, [roomId, userId, userName]);

    return (
        <div
            ref={videoContainerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
        />
    );
}