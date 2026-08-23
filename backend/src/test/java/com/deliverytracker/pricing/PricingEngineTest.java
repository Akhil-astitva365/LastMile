package com.deliverytracker.pricing;

import com.deliverytracker.pricing.dto.OrderQuoteRequest;
import com.deliverytracker.pricing.dto.OrderQuoteResponse;
import com.deliverytracker.zone.Zone;
import com.deliverytracker.zone.ZoneDetectionService;
import com.deliverytracker.zone.ZoneType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PricingEngineTest {

    @Mock
    private ZoneDetectionService zoneDetectionService;

    @Mock
    private RateCardRepository rateCardRepository;

    @Mock
    private CodSurchargeRepository codSurchargeRepository;

    private PricingEngine pricingEngine;

    @BeforeEach
    void setUp() {
        pricingEngine = new PricingEngine(rateCardRepository, codSurchargeRepository, zoneDetectionService);

        Zone dummyZone1 = Zone.builder().id(1L).zoneCode("ZONE-1").zoneName("Test Zone 1").build();
        Zone dummyZone2 = Zone.builder().id(2L).zoneCode("ZONE-2").zoneName("Test Zone 2").build();
        when(zoneDetectionService.detectZoneByAddress("Bhopal")).thenReturn(dummyZone1);
        when(zoneDetectionService.detectZoneByAddress(eq("Indore"))).thenReturn(dummyZone2);
        when(zoneDetectionService.detectZoneByAddress(eq("Sehore"))).thenReturn(dummyZone1);
    }

    @Test
    void testVolumetricWeightAndBillableWeight_HigherVolumetric() {
        // L=50, B=40, H=30 => (50*40*30)/5000 = 12 kg. Actual = 8 kg => Billable = 12 kg
        OrderQuoteRequest request = new OrderQuoteRequest();
        request.setPickupAddress("Bhopal");
        request.setDropAddress("Indore");
        request.setLength(50.0);
        request.setBreadth(40.0);
        request.setHeight(30.0);
        request.setActualWeight(8.0);
        request.setOrderType(OrderType.B2C);
        request.setPaymentType(PaymentType.PREPAID);

        RateCard mockCard = RateCard.builder()
                .minWeight(0.0)
                .maxWeight(50.0)
                .baseCharge(BigDecimal.valueOf(180))
                .perKgCharge(BigDecimal.ZERO)
                .build();
        when(rateCardRepository.findByOrderTypeAndZoneTypeAndActiveTrue(eq(OrderType.B2C), eq(ZoneType.INTER_ZONE)))
                .thenReturn(List.of(mockCard));

        OrderQuoteResponse quote = pricingEngine.calculateQuote(request);

        assertEquals(8.0, quote.getActualWeight());
        assertEquals(12.0, quote.getVolumetricWeight());
        assertEquals(12.0, quote.getBillableWeight());
        assertEquals(BigDecimal.valueOf(180.00).setScale(2), quote.getBaseCharge());
        assertEquals(BigDecimal.ZERO.setScale(2), quote.getCodSurcharge());
        assertEquals(BigDecimal.valueOf(180.00).setScale(2), quote.getFinalCharge());
    }

    @Test
    void testBillableWeight_HigherActualWeight() {
        // L=10, B=10, H=10 => (10*10*10)/5000 = 0.2 kg. Actual = 10 kg => Billable = 10 kg
        OrderQuoteRequest request = new OrderQuoteRequest();
        request.setPickupAddress("Bhopal");
        request.setDropAddress("Sehore");
        request.setLength(10.0);
        request.setBreadth(10.0);
        request.setHeight(10.0);
        request.setActualWeight(10.0);
        request.setOrderType(OrderType.B2B);
        request.setPaymentType(PaymentType.COD);

        RateCard mockCard = RateCard.builder()
                .minWeight(0.0)
                .maxWeight(50.0)
                .baseCharge(BigDecimal.valueOf(150))
                .perKgCharge(BigDecimal.ZERO)
                .build();
        when(rateCardRepository.findByOrderTypeAndZoneTypeAndActiveTrue(eq(OrderType.B2B), eq(ZoneType.INTRA_ZONE)))
                .thenReturn(List.of(mockCard));

        CodSurcharge mockCod = CodSurcharge.builder()
                .surchargeType("FIXED")
                .surchargeValue(BigDecimal.valueOf(50))
                .build();
        when(codSurchargeRepository.findByOrderTypeAndActiveTrue(OrderType.B2B))
                .thenReturn(Optional.of(mockCod));

        OrderQuoteResponse quote = pricingEngine.calculateQuote(request);

        assertEquals(10.0, quote.getActualWeight());
        assertEquals(0.2, quote.getVolumetricWeight());
        assertEquals(10.0, quote.getBillableWeight());
        assertEquals(BigDecimal.valueOf(50.00).setScale(2), quote.getCodSurcharge());
        assertEquals(BigDecimal.valueOf(200.00).setScale(2), quote.getFinalCharge());
    }
}
