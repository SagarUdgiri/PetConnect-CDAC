package com.petconnect;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PetConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetConnectApplication.class, args);
	}

	@Bean
	ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration()
				.setFieldMatchingEnabled(true)
				.setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
		return modelMapper;
	}

	/**
	 * Helper method to map lists.
	 */
	public static <S, T> List<T> mapList(ModelMapper mapper, List<S> source, Class<T> targetClass) {
		return source.stream()
				.map(element -> mapper.map(element, targetClass))
				.collect(Collectors.toList());
	}
}
