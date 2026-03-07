package edu.cit.migallos.techlend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.migallos.techlend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findBySchoolId(String schoolId);

    boolean existsByEmail(String email);

    boolean existsBySchoolId(String schoolId);
}
