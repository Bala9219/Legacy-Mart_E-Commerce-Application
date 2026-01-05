package com.example.E_Commerce.service;

import com.example.E_Commerce.model.Category;
import com.example.E_Commerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }


    public Category create(Category category) {
        if(categoryRepository.existsByName(category.getName())){
            throw new RuntimeException("Category already exists");
        }
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
