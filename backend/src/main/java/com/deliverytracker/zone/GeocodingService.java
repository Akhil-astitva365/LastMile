package com.deliverytracker.zone;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GeocodingService {

    private static final Logger logger = LoggerFactory.getLogger(GeocodingService.class);
    private static final Pattern PINCODE_PATTERN = Pattern.compile("\\b([1-9][0-9]{5})\\b");

    private final RestTemplate restTemplate;
    private final Map<String, LocationCoordinates> cache = new ConcurrentHashMap<>();

    // Comprehensive PAN-INDIA City & Hub Coordinates Database
    private static final Map<String, LocationCoordinates> PAN_INDIA_LOCATIONS = Map.ofEntries(
            Map.entry("bhopal", new LocationCoordinates(23.2599, 77.4126, "Bhopal, MP", "462001")),
            Map.entry("indore", new LocationCoordinates(22.7196, 75.8577, "Indore, MP", "452001")),
            Map.entry("sehore", new LocationCoordinates(23.2032, 77.0845, "Sehore, MP", "466001")),
            Map.entry("vit bhopal", new LocationCoordinates(23.0775, 76.8513, "VIT Bhopal Campus, Kothri Kalan", "466114")),
            Map.entry("delhi", new LocationCoordinates(28.6139, 77.2090, "New Delhi, NCR", "110001")),
            Map.entry("new delhi", new LocationCoordinates(28.6139, 77.2090, "New Delhi, NCR", "110001")),
            Map.entry("noida", new LocationCoordinates(28.5355, 77.3910, "Noida, UP", "201301")),
            Map.entry("gurugram", new LocationCoordinates(28.4595, 77.0266, "Gurugram, HR", "122001")),
            Map.entry("gurgaon", new LocationCoordinates(28.4595, 77.0266, "Gurugram, HR", "122001")),
            Map.entry("mumbai", new LocationCoordinates(19.0760, 72.8777, "Mumbai, MH", "400001")),
            Map.entry("thane", new LocationCoordinates(19.2183, 72.9781, "Thane, MH", "400601")),
            Map.entry("pune", new LocationCoordinates(18.5204, 73.8567, "Pune, MH", "411001")),
            Map.entry("bengaluru", new LocationCoordinates(12.9716, 77.5946, "Bengaluru, KA", "560001")),
            Map.entry("bangalore", new LocationCoordinates(12.9716, 77.5946, "Bengaluru, KA", "560001")),
            Map.entry("chennai", new LocationCoordinates(13.0827, 80.2707, "Chennai, TN", "600001")),
            Map.entry("hyderabad", new LocationCoordinates(17.3850, 78.4867, "Hyderabad, TS", "500001")),
            Map.entry("kolkata", new LocationCoordinates(22.5726, 88.3639, "Kolkata, WB", "700001")),
            Map.entry("ahmedabad", new LocationCoordinates(23.0225, 72.5714, "Ahmedabad, GJ", "380001")),
            Map.entry("jaipur", new LocationCoordinates(26.9124, 75.7873, "Jaipur, RJ", "302001")),
            Map.entry("surat", new LocationCoordinates(21.1702, 72.8311, "Surat, GJ", "395001")),
            Map.entry("lucknow", new LocationCoordinates(26.8467, 80.9462, "Lucknow, UP", "226001")),
            Map.entry("kanpur", new LocationCoordinates(26.4499, 80.3319, "Kanpur, UP", "208001")),
            Map.entry("nagpur", new LocationCoordinates(21.1458, 79.0882, "Nagpur, MH", "440001")),
            Map.entry("patna", new LocationCoordinates(25.5941, 85.1376, "Patna, BR", "800001")),
            Map.entry("chandigarh", new LocationCoordinates(30.7333, 76.7794, "Chandigarh, PB/HR", "160001")),
            Map.entry("coimbatore", new LocationCoordinates(11.0168, 76.9558, "Coimbatore, TN", "641001")),
            Map.entry("kochi", new LocationCoordinates(9.9312, 76.2673, "Kochi, KL", "682001")),
            Map.entry("guwahati", new LocationCoordinates(26.1445, 91.7362, "Guwahati, AS", "781001")),
            Map.entry("bhubaneswar", new LocationCoordinates(20.2961, 85.8245, "Bhubaneswar, OD", "751001")),
            Map.entry("visakhapatnam", new LocationCoordinates(17.6868, 83.2185, "Visakhapatnam, AP", "530001")),
            Map.entry("raipur", new LocationCoordinates(21.2514, 81.6296, "Raipur, CG", "492001")),
            Map.entry("gwalior", new LocationCoordinates(26.2183, 78.1828, "Gwalior, MP", "474001")),
            Map.entry("jabalpur", new LocationCoordinates(23.1815, 79.9864, "Jabalpur, MP", "482001")),
            Map.entry("ujjain", new LocationCoordinates(23.1765, 75.7885, "Ujjain, MP", "456001")),
            Map.entry("agra", new LocationCoordinates(27.1767, 78.0081, "Agra, UP", "282001")),
            Map.entry("varanasi", new LocationCoordinates(25.3176, 82.9739, "Varanasi, UP", "221001")),
            Map.entry("ludhiana", new LocationCoordinates(30.9010, 75.8573, "Ludhiana, PB", "141001")),
            Map.entry("nashik", new LocationCoordinates(19.9975, 73.7898, "Nashik, MH", "422001")),
            Map.entry("vadodara", new LocationCoordinates(22.3072, 73.1812, "Vadodara, GJ", "390001")),
            Map.entry("rajkot", new LocationCoordinates(22.3039, 70.8022, "Rajkot, GJ", "360001")),
            Map.entry("mysore", new LocationCoordinates(12.2958, 76.6394, "Mysore, KA", "570001")),
            Map.entry("madurai", new LocationCoordinates(9.9252, 78.1198, "Madurai, TN", "625001"))
    );

    public GeocodingService() {
        this.restTemplate = new RestTemplate();
    }

    public LocationCoordinates geocode(String address) {
        if (address == null || address.isBlank()) {
            return new LocationCoordinates(23.2599, 77.4126, "Default PAN-India Hub", "462001");
        }

        String normalized = address.trim().toLowerCase();

        // 0. Check internal memory cache
        if (cache.containsKey(normalized)) {
            return cache.get(normalized);
        }

        // 1. Direct match with PAN-India city dictionary
        for (Map.Entry<String, LocationCoordinates> entry : PAN_INDIA_LOCATIONS.entrySet()) {
            if (normalized.contains(entry.getKey())) {
                logger.info("[GEOCODING PAN-INDIA] Matched '{}' to {} ({}, {})", address, entry.getValue().getPlaceName(), entry.getValue().getLatitude(), entry.getValue().getLongitude());
                cache.put(normalized, entry.getValue());
                return entry.getValue();
            }
        }

        // 2. Try OpenStreetMap Nominatim live geocoding service for exact real-world addresses
        try {
            String url = "https://nominatim.openstreetmap.org/search?q=" + java.net.URLEncoder.encode(address, java.nio.charset.StandardCharsets.UTF_8) + "&format=json&limit=1";
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "LastMileDeliveryTracker/1.0 (contact@deliverytracker.com)");
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && !response.getBody().isEmpty()) {
                Map<String, Object> firstResult = (Map<String, Object>) response.getBody().get(0);
                double lat = Double.parseDouble(firstResult.get("lat").toString());
                double lon = Double.parseDouble(firstResult.get("lon").toString());
                String displayName = firstResult.get("display_name").toString();

                LocationCoordinates coords = new LocationCoordinates(lat, lon, displayName, extractPincode(address));
                logger.info("[GEOCODING ONLINE NOMINATIM] Successfully resolved '{}' to ({}, {})", address, lat, lon);
                cache.put(normalized, coords);
                return coords;
            }
        } catch (Exception e) {
            logger.warn("[GEOCODING NOMINATIM] Online geocoding API warning for '{}': {}", address, e.getMessage());
        }

        // 3. Deterministic Hash Location Generator for ANY random, custom, or fictional location not present on standard maps
        LocationCoordinates customCoords = generateDeterministicCoordinates(address);
        cache.put(normalized, customCoords);
        return customCoords;
    }

    public List<LocationCoordinates> getSuggestions(String query) {
        if (query == null || query.trim().length() < 1) {
            return Collections.emptyList();
        }

        String normalized = query.trim().toLowerCase();
        List<LocationCoordinates> suggestions = new java.util.ArrayList<>();

        // 1. Filter PAN_INDIA_LOCATIONS
        for (Map.Entry<String, LocationCoordinates> entry : PAN_INDIA_LOCATIONS.entrySet()) {
            if (entry.getKey().contains(normalized) || entry.getValue().getPlaceName().toLowerCase().contains(normalized)) {
                suggestions.add(entry.getValue());
                if (suggestions.size() >= 6) break;
            }
        }

        // 2. Query Nominatim API if query is >= 3 chars and we need more results
        if (normalized.length() >= 3 && suggestions.size() < 6) {
            try {
                String url = "https://nominatim.openstreetmap.org/search?q=" + java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8) + "&format=json&limit=4";
                HttpHeaders headers = new HttpHeaders();
                headers.set("User-Agent", "LastMileDeliveryTracker/1.0 (contact@deliverytracker.com)");
                headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
                HttpEntity<String> entity = new HttpEntity<>(headers);

                ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    for (Object item : response.getBody()) {
                        Map<String, Object> map = (Map<String, Object>) item;
                        double lat = Double.parseDouble(map.get("lat").toString());
                        double lon = Double.parseDouble(map.get("lon").toString());
                        String displayName = map.get("display_name").toString();

                        boolean exists = suggestions.stream().anyMatch(s -> s.getPlaceName().equalsIgnoreCase(displayName));
                        if (!exists) {
                            suggestions.add(new LocationCoordinates(lat, lon, displayName, extractPincode(displayName)));
                        }
                    }
                }
            } catch (Exception e) {
                logger.warn("[GEOCODING SUGGESTIONS] Online API fallback warning: {}", e.getMessage());
            }
        }

        // 3. Fallback custom suggestion if no match found
        if (suggestions.isEmpty()) {
            suggestions.add(generateDeterministicCoordinates(query));
        }

        // Sort suggestions in ASCENDING ORDER (A to Z) by placeName
        suggestions.sort(java.util.Comparator.comparing(LocationCoordinates::getPlaceName, String.CASE_INSENSITIVE_ORDER));

        return suggestions;
    }

    private LocationCoordinates generateDeterministicCoordinates(String address) {
        int hash = address.toLowerCase().hashCode();
        
        // Generate realistic, distinct latitude between 8.0 N and 35.0 N
        double lat = 8.0 + (Math.abs(hash % 270000) / 10000.0);
        // Generate realistic, distinct longitude between 68.0 E and 96.0 E
        double lon = 68.0 + (Math.abs((hash / 31) % 280000) / 10000.0);

        String pincode = extractPincode(address);
        LocationCoordinates customLoc = new LocationCoordinates(
                Math.round(lat * 10000.0) / 10000.0,
                Math.round(lon * 10000.0) / 10000.0,
                "Custom Location (" + address + ")",
                pincode
        );
        logger.info("[GEOCODING CUSTOM LOCATION] Generated distinct coordinates for random/unknown address '{}' -> ({}, {})", address, customLoc.getLatitude(), customLoc.getLongitude());
        return customLoc;
    }

    private String extractPincode(String text) {
        if (text == null) return "000000";
        Matcher matcher = PINCODE_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "462001";
    }
}
