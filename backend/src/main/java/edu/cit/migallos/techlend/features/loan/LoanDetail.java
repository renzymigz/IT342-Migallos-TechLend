package edu.cit.migallos.techlend.features.loan;

import java.time.LocalDateTime;
import java.util.UUID;

import edu.cit.migallos.techlend.features.equipment.EquipmentItem;
import edu.cit.migallos.techlend.features.loan.enums.LoanItemStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "loan_details")
public class LoanDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "detail_id", updatable = false, nullable = false)
    private UUID detailId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", nullable = false)
    private LoanTransaction transaction;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private EquipmentItem equipment;

    @Column(name = "actual_return_time")
    private LocalDateTime actualReturnTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false)
    private LoanItemStatus itemStatus;

    @Column(name = "staff_remarks")
    private String staffRemarks;

    public UUID getDetailId() {
        return detailId;
    }

    public void setDetailId(UUID detailId) {
        this.detailId = detailId;
    }

    public LoanTransaction getTransaction() {
        return transaction;
    }

    public void setTransaction(LoanTransaction transaction) {
        this.transaction = transaction;
    }

    public EquipmentItem getEquipment() {
        return equipment;
    }

    public void setEquipment(EquipmentItem equipment) {
        this.equipment = equipment;
    }

    public LocalDateTime getActualReturnTime() {
        return actualReturnTime;
    }

    public void setActualReturnTime(LocalDateTime actualReturnTime) {
        this.actualReturnTime = actualReturnTime;
    }

    public LoanItemStatus getItemStatus() {
        return itemStatus;
    }

    public void setItemStatus(LoanItemStatus itemStatus) {
        this.itemStatus = itemStatus;
    }

    public String getStaffRemarks() {
        return staffRemarks;
    }

    public void setStaffRemarks(String staffRemarks) {
        this.staffRemarks = staffRemarks;
    }
}
