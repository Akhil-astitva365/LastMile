package com.deliverytracker.pricing;

import com.deliverytracker.pricing.dto.OrderQuoteRequest;
import com.deliverytracker.pricing.dto.OrderQuoteResponse;
import com.deliverytracker.zone.GeocodingService;
import com.deliverytracker.zone.LocationCoordinates;
import com.deliverytracker.zone.Zone;
import com.deliverytracker.zone.ZoneDetectionService;
import com.deliverytracker.zone.ZoneType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

@Component
public class PricingEngine {

    private final RateCardRepository rateCardRepository;
    private final CodSurchargeRepository codSurchargeRepository;
    private final ZoneDetectionService zoneDetectionService;
    private final GeocodingService geocodingService;

    public PricingEngine(RateCardRepository rateCardRepository, CodSurchargeRepository codSurchargeRepository, ZoneDetectionService zoneDetectionService, GeocodingService geocodingService) {
        this.rateCardRepository = rateCardRepository;
        this.codSurchargeRepository = codSurchargeRepository;
        this.zoneDetectionService = zoneDetectionService;
        this.geocodingService = geocodingService;
    }

    public OrderQuoteResponse calculateQuote(OrderQuoteRequest request) {
        Zone pickupZone = zoneDetectionService.detectZoneByAddress(request.getPickupAddress());
        Zone dropZone = zoneDetectionService.detectZoneByAddress(request.getDropAddress());

        LocationCoordinates pickupCoords = geocodingService.geocode(request.getPickupAddress());
        LocationCoordinates dropCoords = geocodingService.geocode(request.getDropAddress());

        double distanceKm = geocodingService.calculateDistanceKm(
                pickupCoords.getLatitude(), pickupCoords.getLongitude(),
                dropCoords.getLatitude(), dropCoords.getLongitude()
        );

        ZoneType zoneType = determineZoneType(pickupZone, dropZone);

        double volumetricWeight = (request.getLength() * request.getBreadth() * request.getHeight()) / 5000.0;
        double billableWeight = Math.max(request.getActualWeight(), volumetricWeight);

        // Find applicable rate card
        RateCard rateCard = rateCardRepository.findByOrderTypeAndZoneTypeAndActiveTrue(request.getOrderType(), zoneType)
                .stream()
                .filter(rc -> billableWeight >= rc.getMinWeight() && billableWeight <= rc.getMaxWeight())
                .findFirst()
                .orElseGet(() -> getDefaultFallbackRateCard(request.getOrderType(), zoneType));

        // Weight fee: base charge + (per kg fee * billable weight)
        BigDecimal weightCharge = rateCard.getBaseCharge()
                .add(rateCard.getPerKgCharge().multiply(BigDecimal.valueOf(billableWeight)));

        // Dynamic Distance Fee proportional to kilometers:
        // Intra-Zone (same city): ₹3 per km beyond 2 km
        // Inter-Zone / Inter-City: ₹2.50 per km
        double perKmRate = (zoneType == ZoneType.INTRA_ZONE) ? 3.0 : 2.5;
        double billableDistanceKm = (zoneType == ZoneType.INTRA_ZONE) ? Math.max(0.0, distanceKm - 2.0) : distanceKm;
        BigDecimal distanceCharge = BigDecimal.valueOf(billableDistanceKm * perKmRate);

        BigDecimal baseCharge = weightCharge.add(distanceCharge).setScale(2, RoundingMode.HALF_UP);

        BigDecimal codSurcharge = BigDecimal.ZERO;
        if (request.getPaymentType() == PaymentType.COD) {
            codSurcharge = codSurchargeRepository.findByOrderTypeAndActiveTrue(request.getOrderType())
                    .map(CodSurcharge::getSurchargeValue)
                    .orElse(BigDecimal.valueOf(30));
        }

        BigDecimal finalCharge = baseCharge.add(codSurcharge).setScale(2, RoundingMode.HALF_UP);

        return OrderQuoteResponse.builder()
                .actualWeight(request.getActualWeight())
                .volumetricWeight(Math.round(volumetricWeight * 100.0) / 100.0)
                .billableWeight(Math.round(billableWeight * 100.0) / 100.0)
                .distanceKm(distanceKm)
                .pickupZoneCode(pickupZone.getZoneCode())
                .pickupZoneName(pickupZone.getZoneName())
                .dropZoneCode(dropZone.getZoneCode())
                .dropZoneName(dropZone.getZoneName())
                .zoneType(zoneType)
                .orderType(request.getOrderType())
                .paymentType(request.getPaymentType())
                .baseCharge(baseCharge)
                .codSurcharge(codSurcharge)
                .finalCharge(finalCharge)
                .build();
    }

    public ZoneType determineZoneType(Zone pickupZone, Zone dropZone) {
        if (Objects.equals(pickupZone.getId(), dropZone.getId())) {
            return ZoneType.INTRA_ZONE;
        }
        return ZoneType.INTER_ZONE;
    }

    private RateCard getDefaultFallbackRateCard(OrderType orderType, ZoneType zoneType) {
        return RateCard.builder()
                .orderType(orderType)
                .zoneType(zoneType)
                .baseCharge(orderType == OrderType.B2B ? BigDecimal.valueOf(200) : BigDecimal.valueOf(80))
                .perKgCharge(BigDecimal.valueOf(10))
                .build();
    }
}
