package com.example.E_Commerce.config;

import com.example.E_Commerce.model.Category;
import com.example.E_Commerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if(categoryRepository.count() == 0){

            List<Category> categories = List.of(
                    Category.builder().name("Electronics").build(),
                    Category.builder().name("Clothing").build(),
                    Category.builder().name("Books").build(),
                    Category.builder().name("Home & Kitchen").build(),
                    Category.builder().name("Food Items").build()
            );
            categoryRepository.saveAll(categories);
            System.out.println("Categories Seeded");
        }
    }
}
