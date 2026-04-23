package edu.cit.migallos.techlend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConstraintConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(DatabaseConstraintConfig.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseConstraintConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void updateLoanDetailsStatusConstraint() {
        try {
            jdbcTemplate.execute("ALTER TABLE loan_details DROP CONSTRAINT IF EXISTS loan_details_item_status_check");
            jdbcTemplate.execute(
                "ALTER TABLE loan_details ADD CONSTRAINT loan_details_item_status_check CHECK " +
                "(item_status IN ('REQUESTED', 'BORROWED', 'RETURNED', 'DAMAGED', 'LOST'))"
            );
        } catch (Exception ex) {
            LOGGER.warn("Skipping loan_details status constraint update: {}", ex.getMessage());
        }
    }
}
