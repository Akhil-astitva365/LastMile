package com.deliverytracker.ai;

public class AIAgentRequest {
    private String prompt;
    private Long customerUserId;

    public AIAgentRequest() {}

    public AIAgentRequest(String prompt, Long customerUserId) {
        this.prompt = prompt;
        this.customerUserId = customerUserId;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public Long getCustomerUserId() { return customerUserId; }
    public void setCustomerUserId(Long customerUserId) { this.customerUserId = customerUserId; }
}
