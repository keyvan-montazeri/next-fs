"use client";

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  SimpleUser,
  SimpleUserDelegate,
  SimpleUserOptions,
} from 'sip.js/lib/platform/web';

// interface FreeSwitchServer {
//   address: string,
//   port: number,
// }
export default function SipClient() {

  // UI states
  const [connected, setConnected] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [dtmf, setDtmf] = useState("");
  const [onHold, setOnHold] = useState(false);
  const [muted, setMuted] = useState(false);
  // const [data, setData] = useState<FreeSwitchServer | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const simpleUserRef = useRef<SimpleUser | null>(null);
  

  // Config
  const webSocketServer = "ws://192.168.64.3:5066";
  const target = "sip:1001@192.168.64.3";
  const displayName = "SIP.js Demo";
  useEffect(() => {

    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('/api/fs'); // Assuming your API route is at pages/api/hello.ts
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     const result: FreeSwitchServer = await response.json();
    //     setData(result);
    //   } catch (err) {
    //     setError((err as Error).message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
    if (!audioRef.current) return;

    // Delegate
    const delegate: SimpleUserDelegate = {
      onCallCreated: () => {
        console.log(`[${displayName}] Call created`);
        setInCall(true);
      },
      onCallAnswered: () => {
        console.log(`[${displayName}] Call answered`);
      },
      onCallHangup: () => {
        console.log(`[${displayName}] Call hangup`);
        setInCall(false);
        setOnHold(false);
        setMuted(false);
        setDtmf("");
      },
      onCallHold: (held: boolean) => {
        console.log(`[${displayName}] Call hold ${held}`);
        setOnHold(held);
      },
    };

    // Options
    const options: SimpleUserOptions = {
      delegate,
      media: {
        remote: {
          audio: audioRef.current,
        },
      },
      userAgentOptions: { displayName },
    };

    // Construct user
    simpleUserRef.current = new SimpleUser(webSocketServer, options);

    return () => {
      // Cleanup on unmount
      simpleUserRef.current?.disconnect();
    };
    
  }, []);
  
  const connect = async () => {
    try {
      await simpleUserRef.current?.connect();
      setConnected(true);
    } catch (err) {
      console.error("Failed to connect", err);
      alert("Failed to connect");
    }
  };

  const disconnect = async () => {
    try {
      await simpleUserRef.current?.disconnect();
      setConnected(false);
    } catch (err) {
      console.error("Failed to disconnect", err);
      alert("Failed to disconnect");
    }
  };

  const call = async () => {
    try {
      await simpleUserRef.current?.call(target);
    } catch (err) {
      console.error("Failed to call", err);
      alert("Failed to call");
    }
  };

  const hangup = async () => {
    try {
      await simpleUserRef.current?.hangup();
    } catch (err) {
      console.error("Failed to hangup", err);
      alert("Failed to hangup");
    }
  };

  const sendDtmf = async (tone: string) => {
    try {
      await simpleUserRef.current?.sendDTMF(tone);
      setDtmf((prev) => prev + tone);
    } catch (err) {
      console.error("Failed to send DTMF", err);
    }
  };

  const toggleHold = async () => {
    try {
      if (onHold) {
        await simpleUserRef.current?.unhold();
      } else {
        await simpleUserRef.current?.hold();
      }
      setOnHold(!onHold);
    } catch (err) {
      console.error("Hold/unhold failed", err);
    }
  };

  const toggleMute = () => {
    if (!simpleUserRef.current) return;
    if (muted) {
      simpleUserRef.current.unmute();
    } else {
      simpleUserRef.current.mute();
    }
    setMuted(!muted);
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 space-y-4">
      {/* <h1>{data?.address}:{data?.port}</h1> */}
      <h2 className="text-xl font-bold">SIP.js Demo</h2>
      <audio ref={audioRef} id="remoteAudio" controls />
      <div className="space-x-2">
        {!connected ? (
          <button onClick={connect} className="px-4 py-2 bg-green-500 text-white rounded">
            Connect
          </button>
        ) : (
          <button onClick={disconnect} className="px-4 py-2 bg-red-500 text-white rounded">
            Disconnect
          </button>
        )}
        {connected && !inCall && (
          <button onClick={call} className="px-4 py-2 bg-blue-500 text-white rounded">
            Call
          </button>
        )}
        {inCall && (
          <button onClick={hangup} className="px-4 py-2 bg-gray-500 text-white rounded">
            Hangup
          </button>
        )}
      </div>

      {inCall && (
        <>
          <div className="space-x-2">
            {"123456789*0#".split("").map((tone) => (
              <button
                key={tone}
                onClick={() => sendDtmf(tone)}
                className="px-3 py-1 border rounded"
              >
                {tone}
              </button>
            ))}
          </div>
          <p>DTMF Sent: {dtmf}</p>

          <div className="space-x-2">
            <label>
              <input type="checkbox" checked={onHold} onChange={toggleHold} /> Hold
            </label>
            <label>
              <input type="checkbox" checked={muted} onChange={toggleMute} /> Mute
            </label>
          </div>
        </>
      )}
    </div>
  );
}
