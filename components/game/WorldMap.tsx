"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MarkerColor = "blue" | "red";

export interface MapMarker {
  lat: number;
  lng: number;
  color: MarkerColor;
  label?: string;
}

interface WorldMapProps {
  /** 提供时，点击地图会调用此回调并放置/更新蓝色猜测点。 */
  onGuess?: (lat: number, lng: number) => void;
  /** 额外静态标记（如真实位置红色点）。 */
  markers?: MapMarker[];
  /** 地图高度（px）。移动端建议 ≥300。 */
  height?: number;
}

/**
 * 用 divIcon 渲染彩色圆点 marker，规避 leaflet 默认 icon 在 webpack 下 404 的坑。
 */
function makeDivIcon(color: MarkerColor) {
  const bg = color === "red" ? "#dc2626" : "#2563eb";
  return L.divIcon({
    className: "ethno-map-marker",
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${bg};border:3px solid #fff;box-shadow:0 0 6px rgba(0,0,0,0.6);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

/** 监听地图点击的子组件（react-leaflet v4 用 useMapEvents）。 */
function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * 世界地图组件（react-leaflet + OpenStreetMap tiles）。
 * 必须为客户端组件。建议通过 next/dynamic({ ssr: false }) 引入以避免 SSR 访问 window。
 * 设计为可复用：Task 6/7 共用。
 */
export default function WorldMap({
  onGuess,
  markers = [],
  height = 360,
}: WorldMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="w-full rounded-lg bg-gray-100"
        style={{ height }}
        aria-label="Loading map"
      />
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        worldCopyJump
        style={{ height, width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {onGuess && <ClickHandler onClick={onGuess} />}
        {markers.map((m, i) => (
          <Marker
            key={`${m.lat}-${m.lng}-${i}`}
            position={[m.lat, m.lng]}
            icon={makeDivIcon(m.color)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
