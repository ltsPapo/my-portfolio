// src/components/MusicPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

const MusicPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [howl, setHowl] = useState<Howl | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

    const audioFile = '/audio/sample.mp3'; // replace with a real file in /public/audio

    useEffect(() => {
        const sound = new Howl({
            src: [audioFile],
            html5: true,
            onplay: () => setIsPlaying(true),
            onpause: () => setIsPlaying(false),
            onstop: () => setIsPlaying(false),
        });

        setHowl(sound);

        return () => {
            sound.unload();
        };
    }, []);

    useEffect(() => {
        if (!howl || !isPlaying) return;

        const audio = (howl as any)._sounds[0]._node as HTMLAudioElement;
        const ctx = new AudioContext();
        const analyserNode = ctx.createAnalyser();
        const sourceNode = ctx.createMediaElementSource(audio);

        sourceNode.connect(analyserNode);
        analyserNode.connect(ctx.destination);

        setAudioCtx(ctx);
        setAnalyser(analyserNode);
        sourceNodeRef.current = sourceNode;

        drawVisualizer(analyserNode);

        return () => {
            analyserNode.disconnect();
            sourceNode.disconnect();
            ctx.close();
        };
    }, [howl, isPlaying]);

    const drawVisualizer = (analyserNode: AnalyserNode) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyserNode.fftSize = 256;
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!analyserNode || !canvasRef.current) return;
            requestAnimationFrame(draw);

            analyserNode.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
                ctx.fillStyle = 'rgba(0, 200, 255, 0.6)';
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            <h1 className="text-3xl font-bold mb-4">Music Player</h1>

            <canvas ref={canvasRef} width={600} height={200} className="mb-4 border rounded" />

            <div className="flex gap-4">
                <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
                    onClick={() => howl?.play()}
                >
                    Play
                </button>
                <button
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
                    onClick={() => howl?.pause()}
                >
                    Pause
                </button>
                <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
                    onClick={() => howl?.stop()}
                >
                    Stop
                </button>
            </div>
        </div>
    );
};

export default MusicPage;
