import { Activity, ShieldAlert, Cpu, Server, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Operations Dashboard</h1>
            <p className="text-gray-400">Welcome, <span className="text-white font-medium">Acme Corp Operations</span></p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] px-4 py-2 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
            <span className="text-sm text-[#10B981] font-medium font-mono">SYSTEM SECURE</span>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0A0A0B] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 glass-panel-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-sm">Active Nodes</h3>
              <Server className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-white">24<span className="text-gray-500 text-lg">/24</span></div>
            <div className="text-sm text-[#10B981] mt-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> 100% Uptime (30d)
            </div>
          </div>
          
          <div className="bg-[#0A0A0B] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 glass-panel-hover">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-medium text-sm">Threats Blocked</h3>
              <ShieldAlert className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-white">1,402</div>
            <div className="text-sm text-[#10B981] mt-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Zero Breaches
            </div>
          </div>

          <div className="bg-[#0A0A0B] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 glass-panel-hover relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[rgba(16,185,129,0.1)] rounded-full blur-xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-gray-400 font-medium text-sm">Next Maintenance</h3>
              <Cpu className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-white relative z-10">14 <span className="text-gray-500 text-lg">Days</span></div>
            <div className="text-sm text-yellow-500 mt-2 flex items-center relative z-10">
              <Clock className="w-4 h-4 mr-1" /> Scheduled Routine
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white tracking-tight">Active Requests & Tickets</h2>
              <button className="text-sm text-[#10B981] hover:text-white transition-colors">View All Archive</button>
            </div>
            
            <div className="bg-[#1A1A1C] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden glass-panel">
              <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                
                <div className="p-6 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-white font-medium">Server Rack B Backup Restoration Test</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.2)]">IN PROGRESS</span>
                      </div>
                      <p className="text-sm text-gray-400">Quarterly mandated data recovery validation.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Ticket #EJ-4091</div>
                      <div className="text-xs text-gray-500 mt-1">Updated 2h ago</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-white font-medium">Add 3 New Workstation Nodes</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">PENDING HARDWARE</span>
                      </div>
                      <p className="text-sm text-gray-400">Lenovo ThinkPads provisioning for new engineering hires.</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">Ticket #EJ-4088</div>
                      <div className="text-xs text-gray-500 mt-1">Updated 1d ago</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">System Alerts</h2>
            
            <div className="bg-[#0A0A0B] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 h-full flex flex-col space-y-4">
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Bandwidth Spike Detected</h4>
                  <p className="text-xs text-gray-400">Unusual high outbound traffic from Node-04. Traffic has been throttled pending analysis.</p>
                  <div className="text-xs text-gray-500 mt-2">Today, 14:32</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-lg bg-[rgba(16,185,129,0.02)] border border-[rgba(16,185,129,0.1)]">
                <Activity className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white mb-1">Firewall Rules Updated</h4>
                  <p className="text-xs text-gray-400">Automated patch applied referencing CVE-2026-X. Zero downtime.</p>
                  <div className="text-xs text-gray-500 mt-2">Yesterday, 02:00</div>
                </div>
              </div>
              
              <button className="w-full mt-auto py-3 border border-[rgba(16,185,129,0.3)] text-[#10B981] text-sm font-medium rounded-lg hover:bg-[rgba(16,185,129,0.1)] transition-colors">
                View Full Audit Logs
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
