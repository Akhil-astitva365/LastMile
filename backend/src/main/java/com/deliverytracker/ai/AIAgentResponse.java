package com.deliverytracker.ai;

import java.math.BigDecimal;

public class AIAgentResponse {
    private String aiExplanation;
    private String generatedOrderNumber;
    private String pickupAddress;
    private String dropAddress;
    private Double billableWeight;
    private BigDecimal finalCharge;
    private String assignedAgentName;
    private String notificationStatus;

    public AIAgentResponse() {}

    public AIAgentResponse(String aiExplanation, String generatedOrderNumber, String pickupAddress, String dropAddress, Double billableWeight, BigDecimal finalCharge, String assignedAgentName, String notificationStatus) {
        this.aiExplanation = aiExplanation;
        this.generatedOrderNumber = generatedOrderNumber;
        this.pickupAddress = pickupAddress;
        this.dropAddress = dropAddress;
        this.billableWeight = billableWeight;
        this.finalCharge = finalCharge;
        this.assignedAgentName = assignedAgentName;
        this.notificationStatus = notificationStatus;
    }

    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }

    public String getGeneratedOrderNumber() { return generatedOrderNumber; }
    public void setGeneratedOrderNumber(String generatedOrderNumber) { this.generatedOrderNumber = generatedOrderNumber; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDropAddress() { return dropAddress; }
    public void setDropAddress(String dropAddress) { this.dropAddress = dropAddress; }

    public Double getBillableWeight() { return billableWeight; }
    public void setBillableWeight(Double billableWeight) { this.billableWeight = billableWeight; }

    public BigDecimal getFinalCharge() { return finalCharge; }
    public void setFinalCharge(BigDecimal finalCharge) { this.finalCharge = finalCharge; }

    public String getAssignedAgentName() { return assignedAgentName; }
    public void setAssignedAgentName(String assignedAgentName) { this.assignedAgentName = assignedAgentName; }

    public String getNotificationStatus() { return notificationStatus; }
    public void setNotificationStatus(String notificationStatus) { this.notificationStatus = notificationStatus; }
}
