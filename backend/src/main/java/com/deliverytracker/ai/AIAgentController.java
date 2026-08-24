package com.deliverytracker.ai;

import com.deliverytracker.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AIAgentController {

    private final AIAgentService aiAgentService;

    public AIAgentController(AIAgentService aiAgentService) {
        this.aiAgentService = aiAgentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<AIAgentResponse> createOrderByAI(
            @RequestBody AIAgentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        AIAgentResponse response = aiAgentService.processPromptAndCreateOrder(request, currentUser);
        return ResponseEntity.ok(response);
    }
}
