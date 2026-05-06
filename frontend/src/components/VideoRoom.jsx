import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

export default function VideoRoom({ roomId, userId, userName, onLeave }) {
    const videoContainerRef = useRef(null);
    const zpRef = useRef(null); // Reference to hold the Zego instance for cleanup

    useEffect(() => {
        if (!videoContainerRef.current) return;

        const myMeeting = async (element) => {
            const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
            const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

            if (!appID || !serverSecret) {
                console.error("ZegoCloud credentials missing in .env file!");
                return;
            }

            // FORCE all variables to be Strings. ZegoCloud will fail silently if given numbers or undefined.
            const safeRoomId = String(roomId || "fallback-room");
            const safeUserId = String(userId || `user-${Date.now()}`);
            const safeUserName = String(userName || "User");

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                safeRoomId,
                safeUserId,
                safeUserName
            );

            // Initialize the ZEGOCLOUD instance
            const zc = ZegoUIKitPrebuilt.create(kitToken);
            zpRef.current = zc; // Save reference so we can destroy it later

            zc.joinRoom({
                container: element,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
                showPreJoinView: false,
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

        // CLEANUP: Prevents React 18 from creating ghost instances and locking the camera
        return () => {
            if (zpRef.current) {
                zpRef.current.destroy();
            }
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