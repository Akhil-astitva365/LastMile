package com.deliverytracker.zone;

public class LocationCoordinates {
    private Double latitude;
    private Double longitude;
    private String placeName;
    private String pincode;

    public LocationCoordinates() {}

    public LocationCoordinates(Double latitude, Double longitude, String placeName, String pincode) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.placeName = placeName;
        this.pincode = pincode;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
