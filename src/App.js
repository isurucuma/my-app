import logo from "./logo.svg";
import "./App.css";
import {drawMesh} from "./utilities";
import { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemash from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";


const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');


function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // load facemesh
    const runFacemesh = async () => {
        const net = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh, 
          {
            inputResolution: { width: 640, height: 480 },
            scale: 0.8
        }
        );

        setInterval(() => {
          detect(net);

        }, 100)
    };

    const detect = async (net) => {
        if (
            typeof webcamRef.current !== undefined &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {

          
          // //  get video properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

          // set video properties
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

          // set canvas properties
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

          // make detections
            const face = await net.estimateFaces({
              input: video
            });
            // console.log(face);

            const ctx = canvasRef.current.getContext("2d")
            drawMesh(face, ctx);

        }
    };

    runFacemesh()
    return (
        <div className="App">
            <header className="App-header">
                <Webcam
                    ref={webcamRef}
                    style={{
                      position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      zIndex: 9,
                      width: 640,
                      height: 480,
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zIndex: 9,
                        width: 640,
                        height: 480,
                    }}
                />
            </header>
        </div>
        
    );
    
}

export default App;
