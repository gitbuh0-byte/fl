import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Sliders, Cpu, Activity, Info, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { laserSimulatorPresets } from '../data';

export default function WorkshopTour() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(laserSimulatorPresets[0]);
  const [laserPower, setLaserPower] = useState(10); // kW
  const [isCutting, setIsCutting] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [customThickness, setCustomThickness] = useState(6); // mm
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize logs on start
  useEffect(() => {
    setLogs([
      'SYSTEM READY // FORGELINEA 10kW FIBER LASER',
      'Select material profile to load optimal CNC tooling configurations.',
      'No errors in thermal, gas-assist, or optic alignment checks.'
    ]);
  }, []);

  // Update logs when material preset changes
  const handlePresetSelect = (preset: typeof laserSimulatorPresets[0]) => {
    setSelectedPreset(preset);
    setLaserPower(preset.laserPower);
    setCustomThickness(parseInt(preset.optimalThickness));
    setLogs((prev) => [
      ...prev,
      `PROFILE LOADED: ${preset.materialName.toUpperCase()}`,
      `Optimal thickness detected: ${preset.optimalThickness}`,
      `Gas assist automatically routed to: ${preset.gasAssist}`,
      'Ready for trial profile cut.'
    ]);
  };

  // Autoscroll simulator console log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle cutting simulation execution
  const executeProfileCut = () => {
    if (isCutting) return;
    setIsCutting(true);
    setCutProgress(0);
    setLogs((prev) => [
      ...prev,
      '--- INITIATING TRIAL PROFILE CUT ---',
      `Cut program generated for ${customThickness}mm ${selectedPreset.materialName}...`,
      `Gas-assist path verified using ${selectedPreset.gasAssist}...`,
      'Laser focus and pierce sequence engaged.'
    ]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setCutProgress(progress);

      // Append intermediate diagnostic logs based on progress percentage
      if (progress === 16) {
        setLogs((prev) => [...prev, 'Pierce successful. Core melt established.']);
      } else if (progress === 44) {
        setLogs((prev) => [...prev, `Toolpath lock confirmed. Feedrate stabilizing at ${selectedPreset.cuttingSpeed} m/min...`]);
      } else if (progress === 72) {
        setLogs((prev) => [...prev, `Core power verified at ${laserPower}kW. No oxide build-up detected on edges.`]);
      } else if (progress === 100) {
        setLogs((prev) => [
          ...prev,
          'Profile cut complete. Exhaust purge active.',
          `Edge surface finish: 100% oxide-free. Tolerance achieved: ±0.05mm.`,
          'SYSTEM READY FOR PRODUCTION RUN.'
        ]);
        setIsCutting(false);
        clearInterval(interval);
      }
    }, 120);
  };

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      
      {/* Outer ambient steel glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section title and overview of the Forgelinea workshop experience */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-mono text-xs text-[#2E8BC0] uppercase tracking-widest font-semibold">PRECISE SIMULATION</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#fff] tracking-tight mt-2">
            Inside the Forgelinea Workshop <br />
            Our Precision Philosophy
          </h2>
          <p className="font-sans text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Explore the Forgelinea process from material selection to precision finish. This simulator reveals how our steel fabrication workflow keeps every component within engineered tolerance.
          </p>
        </div>

        {/* Outer interactive dashboard panel for the CNC laser simulator */}
        {!isPlaying ? (
          // Video preview thumbnail stage, with glowing play overlay
          <div 
            onClick={() => setIsPlaying(true)}
            className="w-full max-w-4xl mx-auto h-[400px] sm:h-[480px] rounded-[3%] border border-slate-800 overflow-hidden relative group cursor-pointer shadow-2xl bg-slate-950"
          >
            
            {/* High quality workshop background */}
            <img 
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200"
              alt="Forgelinea Laser Cutting Head Sparks"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-700 opacity-60"
            />

            {/* Glowing neon mesh grid frame overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />

            {/* Pulsing Play Button overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white text-slate-950 group-hover:bg-accent-blue group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl group-hover:shadow-accent-blue/30 scale-100 group-hover:scale-105">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <span className="font-mono text-xs text-white tracking-widest uppercase font-bold bg-slate-950/85 border border-slate-800 px-4 py-1.5 rounded-full">
                LAUNCH CNC WORKSHOP EXPERIENCE
              </span>
              <p className="font-sans text-xs text-slate-300 max-w-sm text-center">
                A guided overview of our 10kW fiber laser platform, material handling and quality controls for precision metal components.
              </p>
            </div>
          </div>
        ) : (
          // Active Laser Controller Interface Dashboard
          <div className="w-full max-w-5xl mx-auto bg-slate-950 border border-slate-800 rounded-[3%] shadow-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden">
            
            {/* Top diagnostic header */}
            <div className="lg:col-span-12 flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/60 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse" />
                <h3 className="font-display font-bold text-lg text-white">FORGELINEA CNC FIBER LASER PLATFORM</h3>
              </div>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setIsCutting(false);
                }}
                className="font-mono text-[10px] text-slate-400 hover:text-white border border-slate-800/60 px-3 py-1 rounded hover:border-accent-blue cursor-pointer"
              >
                CLOSE SIMULATOR
              </button>
            </div>

            {/* Left Control Column (Colspan 4): Material presets and custom parameters */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              
              {/* Material Profile selector */}
              <div>
                <label className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-3 font-semibold">
                  Select Material Profile
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {laserSimulatorPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        selectedPreset.id === preset.id
                          ? 'bg-accent-blue/15 border-accent-blue text-white'
                          : 'bg-[#050A0F]/60 border-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-xs">{preset.materialName}</span>
                        <span className="font-mono text-[9px] text-slate-400 mt-0.5">Optimal: {preset.optimalThickness} (Max {preset.maxThickness})</span>
                      </div>
                      {selectedPreset.id === preset.id && <Sparkles className="w-4 h-4 text-accent-blue" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjust Parameters sliders */}
              <div className="bg-[#050A0F]/80 border border-slate-800 p-4 rounded-xl flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-accent-blue border-b border-slate-800/60 pb-2 mb-1">
                  <Sliders className="w-4 h-4" />
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Manual Tuning</span>
                </div>

                {/* Laser power slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-sans text-slate-400">Laser Beam Power</span>
                    <span className="font-mono font-bold text-white">{laserPower} kW</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.5"
                    value={laserPower}
                    onChange={(e) => setLaserPower(parseFloat(e.target.value))}
                    disabled={isCutting}
                    className="w-full accent-blue bg-slate-800 h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[8px] text-slate-400 mt-1">
                    <span>4 kW</span>
                    <span>12 kW</span>
                  </div>
                </div>

                {/* Material Thickness input */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-sans text-slate-400">Material Thickness</span>
                    <span className="font-mono font-bold text-white">{customThickness} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={parseInt(selectedPreset.maxThickness)}
                    value={customThickness}
                    onChange={(e) => setCustomThickness(parseInt(e.target.value))}
                    disabled={isCutting}
                    className="w-full accent-blue bg-slate-800 h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between font-mono text-[8px] text-slate-400 mt-1">
                    <span>1 mm</span>
                    <span>{selectedPreset.maxThickness} Max</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Display Column (Colspan 8): Realtime sparks, cutting display and diagnostics */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              
              {/* CNC Cutting Chamber (Visual display) */}
              <div className="h-[280px] bg-[#03060A] border border-slate-800 rounded-xl relative flex flex-col justify-between overflow-hidden">
                
                {/* Visual labels overlay */}
                <div className="p-3 flex items-center justify-between text-slate-300 z-10">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-widest font-bold">CNC CHAMBER FEED: ACTIVE</span>
                  </div>
                  <span className="font-mono text-[9px] uppercase">SAFETY SHIELD: ARMED</span>
                </div>

                {/* Main Spark / Cutting nozzle visuals */}
                <div className="relative flex-grow flex items-center justify-center">
                  
                  {/* Metal sheet plate line */}
                  <div className="w-4/5 h-[3px] bg-slate-700 rounded absolute top-1/2 left-10 z-0 overflow-hidden">
                    {/* Laser cutting gap progress fill */}
                    {isCutting && (
                      <div 
                        className="h-full bg-accent-blue transition-all duration-150" 
                        style={{ width: `${cutProgress}%` }}
                      />
                    )}
                  </div>

                  {/* Virtual Laser Cutting Head and sparks emitter */}
                  <div 
                    className="absolute z-10 transition-all duration-150 flex flex-col items-center"
                    style={{ 
                      top: '25%', 
                      left: isCutting ? `${10 + (cutProgress * 0.7)}%` : '50%'
                    }}
                  >
                    {/* Laser Nozzle cone vector */}
                    <svg className="w-10 h-10 text-accent-silver" viewBox="0 0 100 100" fill="currentColor">
                      <polygon points="20,10 80,10 65,60 35,60" />
                      <rect x="45" y="60" width="10" height="15" fill="#3A3F44" />
                    </svg>

                    {/* Beam laser line when active */}
                    {(isCutting || laserPower > 0) && (
                      <div 
                        className="w-1 bg-white laser-active relative" 
                        style={{ 
                          height: '40px',
                          backgroundColor: selectedPreset.accentGlow,
                          boxShadow: `0 0 10px 2px ${selectedPreset.accentGlow}`
                        }}
                      >
                        {/* Interactive Spark particles emission */}
                        {isCutting && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4">
                            {[...Array(8)].map((_, i) => {
                              const randomX = (Math.random() - 0.5) * 80;
                              const randomY = Math.random() * 80;
                              const randomDelay = Math.random() * 0.5;
                              return (
                                <div
                                  key={i}
                                  className="absolute rounded-full w-1 h-1 animate-ping"
                                  style={{
                                    backgroundColor: selectedPreset.sparksColor,
                                    transform: `translate(${randomX}px, ${randomY}px)`,
                                    animationDelay: `${randomDelay}s`,
                                    animationDuration: '0.6s'
                                  }}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Material display sheet labeling */}
                  <div className="absolute bottom-4 left-6 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded">
                    <span className="font-mono text-[9px] text-white">PLATE: {selectedPreset.materialName} ({customThickness}mm)</span>
                  </div>
                </div>

                {/* Trial program Progress Bar at bottom */}
                <div className="bg-[#050A0F] border-t border-slate-800 p-3 flex items-center justify-between z-10">
                  <div className="flex items-center space-x-3 w-3/4">
                    <button
                      onClick={executeProfileCut}
                      disabled={isCutting}
                      className={`px-4 py-1.5 rounded font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0 ${
                        isCutting
                          ? 'bg-accent-blue/20 border border-accent-blue/30 text-accent-blue cursor-not-allowed'
                          : 'bg-accent-blue border border-accent-blue text-white hover:bg-accent-blue/80'
                      }`}
                    >
                      {isCutting ? 'CUTTING...' : 'RUN LASER PROFILE'}
                    </button>
                    
                    {/* Visual cut percentage */}
                    {isCutting && (
                      <div className="w-full flex items-center space-x-2">
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-accent-blue h-full" style={{ width: `${cutProgress}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-white shrink-0">{cutProgress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="font-mono text-[9px] text-accent-blue uppercase">10kW ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Console Logs output */}
              <div className="bg-[#020508] border border-slate-800 rounded-xl p-4 flex flex-col h-[150px]">
                <div className="flex items-center space-x-1.5 text-slate-400 border-b border-slate-800/60 pb-2 mb-2 shrink-0">
                  <Cpu className="w-3.5 h-3.5" />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">CNC System Diagnostic Console</span>
                </div>
                
                {/* Logs scrolling body */}
                <div 
                  ref={logContainerRef}
                  className="flex-grow overflow-y-auto font-mono text-[10px] space-y-1.5 pr-2"
                >
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-accent-blue shrink-0">&gt;</span>
                      <span className="text-accent-silver">{log}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
