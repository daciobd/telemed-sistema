import { useLocation } from "wouter";

export default function DebugRouter() {
  const [location] = useLocation();
  
  return (
    <div style={{ 
      position: "fixed", 
      top: "10px", 
      right: "10px", 
      background: "black", 
      color: "white", 
      padding: "10px",
      zIndex: 9999,
      fontSize: "12px"
    }}>
      <div>Current location: {location}</div>
      <div>React Router working: ✅</div>
    </div>
  );
}