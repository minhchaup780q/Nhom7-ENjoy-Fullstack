package com.example.learningservice.entities.enums;

import lombok.Getter;

@Getter
public enum RankTier {
    BRONZE(1, "Đồng", "Bronze", "#cd7f32"),
    SILVER(2, "Bạc", "Silver", "#c0c0c0"),
    GOLD(3, "Vàng", "Gold", "#ffd700"),
    SAPPHIRE(4, "Lam Ngọc", "Sapphire", "#0f52ba"),
    RUBY(5, "Hồng Ngọc", "Ruby", "#e0115f"),
    EMERALD(6, "Ngọc Lục Bảo", "Emerald", "#50c878"),
    AMETHYST(7, "Thạch Anh Tím", "Amethyst", "#9966cc"),
    PEARL(8, "Ngọc Trai", "Pearl", "#eae0c8"),
    OBSIDIAN(9, "Hắc Diệu Thạch", "Obsidian", "#3b3c36"),
    DIAMOND(10, "Kim Cương", "Diamond", "#b9f2ff");

    private final int level;
    private final String nameVi;
    private final String nameEn;
    private final String hexColor;

    RankTier(int level, String nameVi, String nameEn, String hexColor) {
        this.level = level;
        this.nameVi = nameVi;
        this.nameEn = nameEn;
        this.hexColor = hexColor;
    }

    public RankTier getNextTier() {
        if (this == DIAMOND) {
            return DIAMOND;
        }
        return values()[this.ordinal() + 1];
    }
}
