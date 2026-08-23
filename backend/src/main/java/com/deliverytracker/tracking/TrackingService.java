package com.deliverytracker.tracking;

import com.deliverytracker.order.OrderStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrackingService {

    private final TrackingEventRepository trackingEventRepository;

    public TrackingService(TrackingEventRepository trackingEventRepository) {
        this.trackingEventRepository = trackingEventRepository;
    }

    @Transactional
    public TrackingEvent logEvent(
            Long orderId,
            OrderStatus previousStatus,
            OrderStatus newStatus,
            Long actorId,
            ActorRole actorRole,
            Double latitude,
            Double longitude,
            String remarks
    ) {
        TrackingEvent event = TrackingEvent.builder()
                .orderId(orderId)
                .previousStatus(previousStatus)
                .newStatus(newStatus)
                .actorId(actorId)
                .actorRole(actorRole)
                .latitude(latitude)
                .longitude(longitude)
                .remarks(remarks)
                .build();

        return trackingEventRepository.save(event);
    }

    public List<TrackingEvent> getTrackingHistory(Long orderId) {
        return trackingEventRepository.findByOrderIdOrderByCreatedAtAsc(orderId);
    }
}
