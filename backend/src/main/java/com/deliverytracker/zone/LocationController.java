package com.deliverytracker.zone;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    private final GeocodingService geocodingService;

    public LocationController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<LocationCoordinates>> getSuggestions(@RequestParam("query") String query) {
        List<LocationCoordinates> suggestions = geocodingService.getSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}
