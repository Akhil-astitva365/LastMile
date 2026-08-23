import React from 'react';
import { TrackingEvent } from '../types';
import { CheckCircle2, Clock, MapPin, UserCheck, AlertCircle } from 'lucide-react';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-slate-400 text-sm py-4 text-center">No tracking events recorded yet.</div>;
  }

  return (
    <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-4">
      {events.map((event, idx) => {
        const isLatest = idx === events.length - 1;
        const isFailed = event.newStatus === 'FAILED';

        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node icon */}
            <span
              className={`absolute -left-[31px] top-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                isFailed
                  ? 'bg-rose-500 text-white ring-4 ring-rose-950'
                  : isLatest
                  ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-950 animate-pulse'
                  : 'bg-emerald-500 text-slate-950 ring-4 ring-slate-950'
              }`}
            >
              {isFailed ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </span>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm tracking-wide text-cyan-400">
                  {event.newStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>

              {event.remarks && <p className="text-sm text-slate-300 mt-2 font-medium">{event.remarks}</p>}

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/50">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-cyan-500" />
                  By {event.actorRole}
                </span>
                {event.latitude && event.longitude && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
