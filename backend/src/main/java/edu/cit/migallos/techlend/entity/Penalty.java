package edu.cit.migallos.techlend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import edu.cit.migallos.techlend.enums.PenaltyStatus;
import edu.cit.migallos.techlend.enums.PenaltyType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "penalties")
public class Penalty {

    @Id
    private UUID penaltyId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "detail_id")
    private LoanDetail loanDetail;

    @Enumerated(EnumType.STRING)
    private PenaltyType type;

    @Enumerated(EnumType.STRING)
    private PenaltyStatus status;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private LocalDateTime createdAt;

    public UUID getPenaltyId() {
        return penaltyId;
    }

    public void setPenaltyId(UUID penaltyId) {
        this.penaltyId = penaltyId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LoanDetail getLoanDetail() {
        return loanDetail;
    }

    public void setLoanDetail(LoanDetail loanDetail) {
        this.loanDetail = loanDetail;
    }

    public PenaltyType getType() {
        return type;
    }

    public void setType(PenaltyType type) {
        this.type = type;
    }

    public PenaltyStatus getStatus() {
        return status;
    }

    public void setStatus(PenaltyStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
