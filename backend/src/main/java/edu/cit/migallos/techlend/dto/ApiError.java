package edu.cit.migallos.techlend.dto;

public class ApiError {

    private String code;
    private String message;
    private Object details;

    public ApiError(String code, String message, Object details) {
        this.code = code;
        this.message = message;
        this.details = details;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Object getDetails() {
        return details;
    }
}
