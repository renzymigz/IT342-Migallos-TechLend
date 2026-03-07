package edu.cit.migallos.techlend.security;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService {

    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, Date expiration) {
        blacklist.put(token, expiration);
    }

    public boolean isBlacklisted(String token) {
        return blacklist.containsKey(token);
    }

    // Purge expired tokens every hour to prevent unbounded memory growth
    @Scheduled(fixedRate = 3_600_000)
    public void purgeExpired() {
        Date now = new Date();
        blacklist.entrySet().removeIf(entry -> entry.getValue().before(now));
    }
}
