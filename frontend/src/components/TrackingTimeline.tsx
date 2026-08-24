import React from 'react';
import { TrackingEvent } from '../types';
import { CheckCircle2, Clock, MapPin, UserCheck, AlertCircle } from 'lucide-react';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-neutral-400 text-xs py-4 text-center font-bold">No tracking events recorded yet.</div>;
  }

  return (
    <div className="relative pl-6 border-l-2 border-neutral-800 space-y-6 my-4">
      {events.map((event, idx) => {
        const isLatest = idx === events.length - 1;
        const isFailed = event.newStatus === 'FAILED' || event.newStatus === 'FAILED_DELIVERY';

        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node icon */}
            <span
              className={`absolute -left-[31px] top-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                isLatest
                  ? 'bg-white text-black ring-4 ring-neutral-900 shadow-md'
                  : 'bg-neutral-900 text-white ring-4 ring-black border border-neutral-700'
              }`}
            >
              {isFailed ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </span>

            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm tracking-wide text-white">
                  {(event.newStatus || (event as any).status || 'UPDATED').replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>

              {event.remarks && <p className="text-xs text-neutral-300 font-medium">{event.remarks}</p>}

              <div className="mt-2 flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-900">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-white" />
                  By {event.actorRole}
                </span>
                {event.latitude && event.longitude && (
                  <span className="flex items-center gap-1 text-neutral-400">
                    <MapPin className="w-3 h-3 text-white" />
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
