import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, AlertTriangle, Clock } from "lucide-react";

export default function NotificationsBell({ idSuffix = "" }) {
  const [data, setData] = useState({ count: 0, items: [], expiring: [] });

  useEffect(() => {
    const load = () => api.get("/alerts").then((r) => setData(r.data)).catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const lows = data.items || [];
  const expiring = data.expiring || [];
  const empty = lows.length === 0 && expiring.length === 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button data-testid={`alerts-bell${idSuffix}`} className="relative p-2 rounded-lg hover:bg-secondary text-slate-600">
          <Bell className="w-5 h-5" />
          {data.count > 0 && (
            <span data-testid={`alerts-count${idSuffix}`} className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center">
              {data.count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b font-semibold text-sm">Alerts</div>
        <div className="max-h-80 overflow-y-auto">
          {empty ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">All good — nothing needs attention 🎉</p>
          ) : (
            <>
              {lows.length > 0 && (
                <>
                  <div className="px-4 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground bg-secondary/50 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-rose-500" /> Low stock</div>
                  {lows.map((i) => (
                    <Link to="/inventory" key={i.id} data-testid={`alert-${i.id}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary border-b last:border-0">
                      <span className="text-sm font-medium">{i.name}</span>
                      <span className="text-xs font-mono text-rose-600">{i.current_qty}/{i.par_level} {i.unit}</span>
                    </Link>
                  ))}
                </>
              )}
              {expiring.length > 0 && (
                <>
                  <div className="px-4 py-1.5 text-[11px] font-semibold uppercase text-muted-foreground bg-secondary/50 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" /> Prep use-by</div>
                  {expiring.map((e) => (
                    <Link to="/prep" key={e.id} data-testid={`expiry-${e.id}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary border-b last:border-0">
                      <span className="text-sm font-medium">{e.name}{e.portions ? <span className="text-muted-foreground font-normal"> · {e.portions} {e.unit} kept</span> : null}</span>
                      <span className={`text-xs font-semibold ${e.last_day ? "text-rose-600" : "text-amber-600"}`}>{e.last_day ? "today" : "tomorrow"}</span>
                    </Link>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        {lows.length > 0 && (
          <Link to="/suppliers" className="block px-4 py-2.5 text-sm text-primary font-medium border-t hover:bg-secondary">Review supplier orders →</Link>
        )}
      </PopoverContent>
    </Popover>
  );
}
