package com.example.learningservice.services.impl;

import com.example.learningservice.entities.Level;
import com.example.learningservice.repositories.LevelRepository;
import com.example.learningservice.services.LevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // Tự động inject dependency, không cần viết constructor hay @Autowired
public class LevelServiceImpl implements LevelService {

    private final LevelRepository levelRepository;

    @Override
    public List<Level> getAllActiveLevels() {
        return levelRepository.findByIsDeleteFalseOrderByOrderIndexAsc();
    }

    @Override
    public Level getLevelById(Long id) {
        return levelRepository.findByIdAndIsDeleteFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Level hoặc đã bị xóa!"));
    }

    @Override
    public Level createLevel(Level level) {
        level.setCreateAt(LocalDateTime.now());
        level.setIsDelete(false);
        return levelRepository.save(level);
    }

    @Override
    public void deleteLevel(Long id) {
        Level level = getLevelById(id);
        level.setIsDelete(true); // Chỉ cập nhật cờ isDelete, không xóa thật (Soft Delete)
        level.setUpdateAt(LocalDateTime.now());
        levelRepository.save(level);
    }
}