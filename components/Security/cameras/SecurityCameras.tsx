"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import { Clock, Settings, Bell, Shield, VideoOff } from "lucide-react";

interface Camera {
  id: number;
  name: string;
  status: "active" | "offline";
  streamUrl?: string;
}

export function SecurityMonitor() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const [cameras] = useState<Camera[]>([
    {
      id: 1,
      name: "Playground",
      status: "active",
      streamUrl:
        "https://g0.ipcamlive.com/player/player.php?alias=644ca63fd2995&autoplay=1",
    },
    {
      id: 2,
      name: "Skate Zone",
      status: "active",
      streamUrl: "https://www.youtube.com/embed/vxTzgaAQErs?autoplay=1",
    },
    {
      id: 3,
      name: "Softball Field",
      status: "active",
      streamUrl: "https://www.youtube.com/embed/d_a_ZHOZyT8?autoplay=1",
    },
    {
      id: 4,
      name: "Pool Area Camera 1",
      status: "active",
      streamUrl: "https://www.youtube.com/embed/nvB53fb2URw?autoplay=1",
    },
  ]);

  useEffect(() => {
    // Simulamos que se carga la página por 2 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="in-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* HEADER */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <Shield className="text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Security Control Room
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-white font-mono text-sm">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="text-gray-300" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="text-gray-300" />
            </Button>
          </div>
        </div>
      </header>

      {/* CAMERAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className="bg-black border border-slate-700 overflow-hidden rounded-md"
          >
            {/* VIDEO */}
            <div className="relative aspect-video bg-black">
              {isLoading ? (
                <div className="absolute inset-0 flex justify-center items-center text-gray-500">
                  <div className="w-24 h-24 border-4 border-t-4 border-purple-400 rounded-full animate-spin"></div>
                </div>
              ) : camera.status === "offline" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-sm">
                  <VideoOff className="mb-2" />
                  SIGNAL LOST
                </div>
              ) : (
                camera.status === "active" &&
                camera.streamUrl && (
                  <iframe
                    src={camera.streamUrl}
                    className="absolute inset-0 w-full h-full
                             pointer-events-none
                             filter grayscale-[20%] contrast-110 brightness-90"
                    allow="autoplay; fullscreen"
                  />
                )
              )}

              {/* SCANLINES */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10
                           bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
                           bg-[size:100%_4px]"
              />

              {/* OVERLAYS */}
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-xs font-mono text-green-400 rounded">
                ● LIVE
              </div>

              {/* OVERLAY BOTTOM (TAPA YOUTUBE) */}
              <div className="absolute bottom-0 left-0 w-full h-12 bg-black/100 flex items-center justify-between px-3 text-xs font-mono">
                <span className="text-gray-200">{camera.name}</span>

                <span className="text-gray-400">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
