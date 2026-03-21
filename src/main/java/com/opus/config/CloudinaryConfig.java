package com.opus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {

	@Bean
	public Cloudinary cloudinary() {
		return new Cloudinary(ObjectUtils.asMap("cloud_name", "dfbiwzvf9", "api_key", "417285465284398",
				"api_secret", "2wByRo4VNqOLb88C0NIL_91sSWs"));
	}
}