package com.smartcrop.repository;

import com.smartcrop.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    Optional<Crop> findByNameIgnoreCase(String name);
    List<Crop> findByCategoryIgnoreCase(String category);
    List<Crop> findAllByOrderByNameAsc();
}
