import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { gsap } from "gsap";
import logoUrl from "@/assets/screenshot.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const lampRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleLogin = async () => {
    if (!employeeId || !employeeName) return;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          employeeName,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Invalid Login!");
        return;
      }

      // Save validated employee data
      localStorage.setItem("employeeData", JSON.stringify(data.employee));

      // Run clock-in animation
      setIsAnimating(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            setLocation("/tracker");
          }, 500);
        },
      });

      tl.to(chainRef.current, {
        y: 40,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          lampRef.current,
          {
            rotation: 15,
            duration: 0.4,
            ease: "elastic.out(1, 0.3)",
          },
          "-=0.2"
        )
        .to(
          glowRef.current,
          {
            opacity: 1,
            scale: 1.5,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          formRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.4,
          },
          "-=0.4"
        );
    } catch (error) {
      alert("Server error — could not login");
      console.error("Login Error:", error);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      lampRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
    );
    gsap.fromTo(
      formRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logoUrl}
            alt="Knockturn Private Limited"
            className="h-16 object-contain drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
        </div>

        {/* Lamp Animation */}
        <div className="flex flex-col items-center mb-8">
          <div ref={chainRef} className="w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-600" />
          <div ref={lampRef} className="relative">
            <svg width="80" height="60" viewBox="0 0 80 60" className="drop-shadow-lg">
              <path
                d="M20 10 L40 0 L60 10 L60 40 L20 40 Z"
                fill="url(#lampGradient)"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="lampGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div
              ref={glowRef}
              className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-0"
              style={{ width: "120px", height: "120px", left: "-20px", top: "-30px" }}
            />
          </div>
        </div>

        {/* Login Form */}
        <div ref={formRef}>
          <Card className="p-8 backdrop-blur-xl bg-black/40 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Employee Login
            </h1>
            <p className="text-center text-muted-foreground mb-6">Pull the lamp to clock in</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeId" className="text-foreground">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  placeholder="Enter your employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  disabled={isAnimating}
                  className="mt-1 bg-black/50 border-blue-500/40 focus:border-blue-500 text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="employeeName" className="text-foreground">
                  Employee Name
                </Label>
                <Input
                  id="employeeName"
                  placeholder="Enter your full name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  disabled={isAnimating}
                  className="mt-1 bg-black/50 border-blue-500/40 focus:border-blue-500 text-foreground"
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={!employeeId || !employeeName || isAnimating}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
              >
                {isAnimating ? "Clocking In..." : "Clock In"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
