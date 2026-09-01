package edu.vn.iuh.fit.userservice.repositories;

import edu.vn.iuh.fit.userservice.entities.Family;
import edu.vn.iuh.fit.userservice.entities.enums.FamilyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    List<Family> findByParentId(Long parentId);
    List<Family> findByStudentId(Long studentId);
    Optional<Family> findByParentIdAndStudentId(Long parentId, Long studentId);
    List<Family> findByStudentIdAndStatus(Long studentId, FamilyStatus status);
}
